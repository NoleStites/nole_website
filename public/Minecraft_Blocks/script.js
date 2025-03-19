let intial_texture_size = 0;
let initial_rows_cols = 0;
let num_columns = 0;
let num_rows = 0;
let texture_size = 0;
let speed = 100;
// To add new textures, create new directory in "textures" folder, fill it with images, and place the name of the new folder in the list below and you're done!
const texture_types = ['animal', 'building', 'ore', 'plant', 'redstone', 'sediment', 'stone', 'utility', 'wood'];
let textures = {};
let selections = [];
let current_generation = 0; // Used to stop previous animation when beginning a new one

window.onload = function() {
    initialize_vars();
    document.getElementById("texture_size_input").placeholder = texture_size;
    document.getElementById("texture_size_input").value = texture_size;
    document.getElementById("speed_input").value = 100;
    make_flex_grid(num_columns, num_rows, texture_size);
    fetchTexturesFromServer();
    // Refer to the bottom of 'fetchTexturesFromServer()' for the rest of the ToDos
}

function fetchTexturesFromServer() {
    const fetchPromises = texture_types.map((subdir) => {
      return fetch(`/api/files/${subdir}`)
        .then((response) => response.json())
        .then((files) => ({ subdir, files }))
        .catch((error) => {
          console.error(`Error fetching files from ${subdir}:`, error);
          return { subdir, files: [] }; // Handle error gracefully
        });
    });
  
    Promise.all(fetchPromises).then((results) => {
      results.forEach(({ subdir, files }) => {
        textures[subdir] = files;
      });
      // ToDo after textures are fetched
      make_grids(texture_types);
    });
}

function initialize_vars() {
    intial_texture_size = 72;
    initial_rows_cols = calc_num_texture_spots(intial_texture_size);
    num_columns = initial_rows_cols['columns'];
    num_rows = initial_rows_cols['rows'];
    texture_size = intial_texture_size;
}

function calc_num_texture_spots(texture_dimension) {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    let columns = Math.ceil(vw / texture_dimension);
    let rows = Math.ceil(vh / texture_dimension);

    return {'columns':columns, 'rows':rows};
}

function make_flex_grid(columns, rows, texture_size) {
    let grid = document.createElement("div");

    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div");
        row.classList.add('flexbox');
        // let row = [];
        for (let j = 0; j < columns; j++) {
            // row.push("<div key={j} className={`texture_box diagonal_${j+i}`} style={spot_styles}></div>");
            let newDiv = document.createElement("div");
            newDiv.classList.add(`texture_box`);
            newDiv.classList.add(`diagonal_${j+i}`);
            newDiv.style.minHeight = texture_size+'px';
            newDiv.style.minWidth = texture_size+'px';
            row.appendChild(newDiv);
        }
        grid.appendChild(row);
    }
    let flex_section = document.getElementById("texture_grid");
    while (flex_section.firstChild) { // Empty the grid before generating a new one
        flex_section.removeChild(flex_section.firstChild);
    }
    flex_section.appendChild(grid);
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.left = "0px";
    document.getElementById("main").style.marginLeft = "350px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.left = "-350px";
    document.getElementById("main").style.marginLeft = "0";
}

function changeTextureSize() {
    let value = document.getElementById('texture_size_input').value;
    if (value < 20 || value % 4 !== 0) {
        return;
    }

    // Automatically adjust column and rows to fit screen
    let num_cols_rows = calc_num_texture_spots(value); // Calculate how many texture spots can fit on the screen
    num_columns = num_cols_rows['columns'];
    num_rows = num_cols_rows['rows'];
    texture_size = value;
    make_flex_grid(num_columns, num_rows, texture_size);
}

function changeSpeed() {
    let value = document.getElementById('speed_input').value;
    speed = value;
}

// Helper to add items to selection dictionary
function add_selection(box_id) {
    let box = document.getElementById(box_id);
    let text_type = box.classList[1]; // 'animal', 'stone', etc.
    let url = box.style.backgroundImage;
    selections.push(url);

    let check_id = box_id+'_check';
    let check_obj = document.getElementById(check_id);
    check_obj.checked = true;
    box.style.backgroundColor = 'green';
}

// Helper to remove items from selection dictionary
function remove_selection(box_id) {
    // Uncheck the box
    let check_id = box_id+'_check';
    let check = document.getElementById(check_id);
    check.checked = false;

    // Remove the green background color
    let box = document.getElementById(box_id);
    let url = box.style.backgroundImage;
    box.style.backgroundColor = 'rgb(29, 29, 29)';

    selections = selections.filter(e => e !== url);
}

function handle_selection(box_id) {
    let check_id = box_id+'_check';
    let check_obj = document.getElementById(check_id);
    let isChecked = check_obj.checked;

    if (isChecked) {
        add_selection(box_id);
    } else {
        remove_selection(box_id);
    }
    return;
}

function clear_texture_selections() {
    let check_boxes = document.getElementsByClassName('texture_checks');
    for (let i = 0; i < check_boxes.length; i++) {
        let curr_check = check_boxes[i];
        if (curr_check.checked) {
            let box_id = curr_check.id.split('_check')[0];
            remove_selection(box_id);
        }
    }
}

function select_all_textures() {
    let check_boxes = document.getElementsByClassName('texture_checks');
    for (let i = 0; i < check_boxes.length; i++) {
        let curr_check = check_boxes[i];
        if (!curr_check.checked) {
            let box_id = curr_check.id.split('_check')[0];
            add_selection(box_id);
        }
    }
}

function make_texture_grid(texture_type) {
    let curr_t = textures[texture_type]; // curr_t is a list of files names for the given texture_type
    let formatted_string = texture_type[0].toUpperCase() + texture_type.substring(1, texture_type.length);
    let texture_section = document.createElement("div");
    texture_section.classList.add("texture_flex_section");
    
    let title = document.createElement("h3");
    title.classList.add("texture_section_title");
    title.innerHTML = formatted_string;
    texture_section.appendChild(title);

    for (let i = 0; i < curr_t.length; i++) {
        let check_id = curr_t[i]+'_check';

        let new_texture = document.createElement("div");
        new_texture.classList.add("texture_checkbox");
        new_texture.classList.add(texture_type);
        new_texture.id = curr_t[i]; // file name is ID
        new_texture.style.backgroundImage = `url('textures/${texture_type}/${curr_t[i]}')`;
        console.log(new_texture.style.backgroundImage);

        // Insert invisible checkbox into new texture div
        let check = document.createElement("input");
        check.classList.add("texture_checks");
        check.id = check_id;
        check.type = "checkbox";
        // check.onchange = handle_selection(curr_t[i]); // Send file name as param
        check.addEventListener(
            'change',
            function() { handle_selection(curr_t[i]); },
            false
         );
        new_texture.appendChild(check);

        texture_section.appendChild(new_texture);
    }
    return texture_section;
}

function make_grids(texture_type_names) {
    let grid = document.getElementById("texture_flex");
    for (let i = 0; i < texture_type_names.length; i++) {
        let curr_type = texture_type_names[i];
        let section = make_texture_grid(curr_type);
        grid.appendChild(section);
    }
}

function generate() {
    if (selections.length === 0) {
        return; // No textures chosen
    }

    current_generation += 1;
    let my_generation = current_generation;

    // First, remove borders from each grid_spot
    let boxes = document.getElementsByClassName('texture_box');
    if (speed > 0) { // Only for non-instant generation
        for (let i = 0; i < boxes.length; i++) {
            let curr_box = boxes[i];
            curr_box.style.backgroundImage = 'none';
            curr_box.style.boxShadow = '0px 0px rgba(0,0,0,0)';
            curr_box.style.backgroundSize = '0%';
        }
    }

    let num_textures = selections.length;
    let num_diagonals = num_columns + num_rows - 1;
    let selections_copy = selections;

    // Loop through each diagonal to generate textures with time delay
    for (let i = 0; i < num_diagonals; i++) {
        let curr_diagonal = document.getElementsByClassName("diagonal_"+i);
        // Loop through each grid_spot in the current diagonal and assign texture
        setTimeout(() => {
            for (let j = 0; j < curr_diagonal.length; j++) {
                if (my_generation !== current_generation) {
                    return; // Another generation is about to start, so stop this animation
                }
                let diagonal_spot = curr_diagonal[j];
                // Choose a random texture from the given list of textures
                let random_index = Math.floor(Math.random() * num_textures);
                let random_texture = selections_copy[random_index];
                diagonal_spot.style.backgroundImage = random_texture;
                diagonal_spot.style.backgroundSize = '100%';
            }
        }, i*speed);
    }
}