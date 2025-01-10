// Set cell size to 10% of smallest dimension (width or height) of game box
let game_box = document.getElementById("grid");
let viewWidth = game_box.offsetWidth;
let viewHeight = game_box.offsetHeight;
let smallDimension = Math.min(viewWidth, viewHeight);
const cell_size = Math.floor(smallDimension * 0.10);

const border_size = Math.ceil(cell_size*(4/50)); // Because 4px was good for cell_size 50, use as ration for other sizes
const border_spacing = Math.ceil(cell_size*(2/50));
const table_dimensions = calc_num_rows_and_cols(cell_size + (2*border_size) + border_spacing);
const rows = table_dimensions['rows'];
const cols = table_dimensions['columns'];
// let max_bombs = Math.floor(Math.sqrt(rows*cols)) + 15; // square root of the total number of cells
let max_bombs = 2;
let chance_for_bomb = max_bombs / (rows*cols);
let hidden_cells = []; // A list of string coords: x,y
let has_won = false; // Used by the onClick listener to not let user interact with game after finishing

// function resizeCells() {
//     let game_box = document.getElementById("grid");
//     let viewWidth = game_box.offsetWidth;
//     let viewHeight = game_box.offsetHeight;
//     let smallDimension = Math.min(viewWidth, viewHeight);
//     let cell_size = 0;
//     if (smallDimension === viewWidth) {
//         cell_size = Math.floor(smallDimension / cols);
//     }
//     else {
//         cell_size = Math.floor(smallDimension / rows);
//     }
//     console.log(`After: ${cell_size}\n`);
//     const border_size = Math.ceil(cell_size*(4/50)); // Because 4px was good for cell_size 50, use as ration for other sizes

//     let cells = document.getElementsByClassName("cells");
//     for (let i = 0; i < cells.length; i++) {
//         let cell = cells[i];
//         cell.style.width = `${cell_size}px`;
//         cell.style.height = `${cell_size}px`;
//         cell.style.minWidth = `${cell_size}px`;
//         cell.style.minHeight = `${cell_size}px`;
//         cell.style.border = `${border_size}px outset rgb(205, 205, 205)`;
//     }
// }
// addEventListener("resize", (event) => {
//     console.log(`Before: ${cell_size}`);
//     resizeCells();
// });

let flags_toggled = false;
// Called by the HTML code
function toggleFlag() {
    let toggle = document.getElementById("flag_toggle");

    if (flags_toggled) {
        toggle.style.justifyContent = "flex-start";
        toggle.style.backgroundColor = "lightgrey";

        // Remove flag icon from unflagged tiles
        for (let i = 0; i < hidden_cells.length; i++) {
            let cell = document.getElementById(hidden_cells[i]);
            if (cell.style.backgroundImage !== `url("number_textures/flag.png")`) { // no flag, so remove background
                cell.style.backgroundImage = "none";
            }
        }

        flags_toggled = false;
    } else {
        toggle.style.justifyContent = "flex-end";
        toggle.style.backgroundColor = "grey";

        // Display flag icon on cells
        for (let i = 0; i < hidden_cells.length; i++) {
            let cell = document.getElementById(hidden_cells[i]);
            if (cell.style.backgroundImage !== `url("number_textures/flag.png")`) { // no flag, so add background
                cell.style.backgroundImage = "url(number_textures/flag_transparent.png)";
            }
        }

        flags_toggled = true;
    }
}

function calc_num_rows_and_cols(texture_dimension) {
    let grid = document.getElementById("grid");
    const gridWidth = grid.offsetWidth;
    const gridHeight = grid.offsetHeight;

    let num_rows = Math.floor(gridHeight / texture_dimension);
    let num_columns = Math.floor(gridWidth / texture_dimension);

    return {'columns':num_columns, 'rows':num_rows};
}

// Returns a value between 0 and max (exclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function makeTable() {

let box = document.getElementById("grid");
let table = document.createElement("table");
table.id = "mine_table";
table.style.borderSpacing = `${border_spacing}px`;
table.style.borderColor = "grey";

// Reset the flag toggle
flags_toggled = false;
let toggle = document.getElementById("flag_toggle");
toggle.style.justifyContent = "flex-start";
toggle.style.backgroundColor = "lightgrey";

// Create grid and assign bombs
let num_bombs = 0;
let correct_flags = 0; // The number of flags correctly placed (on a bomb)
for (let i = 0; i < rows; i++) {
    let new_row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
        let new_cell = document.createElement("td");
        new_cell.classList.add("cells");
        new_cell.id = `${i},${j}`; // Every table cell is given a coordinate for future reference
        hidden_cells.push(`${i},${j}`);
        new_cell.style.width = `${cell_size}px`;
        new_cell.style.height = `${cell_size}px`;
        new_cell.style.minWidth = `${cell_size}px`;
        new_cell.style.minHeight = `${cell_size}px`;
        new_cell.style.border = `${border_size}px outset rgb(205, 205, 205)`;
        if (Math.random() < chance_for_bomb) { // Math.random returns value 0 to 1
            new_cell.classList.add("bombs");
            num_bombs += 1;
        } else {
            new_cell.classList.add("n0"); // to be incremented. Zero means no value in cell
        }
        new_row.appendChild(new_cell);
    }
    table.appendChild(new_row);
}
let num_flags = num_bombs;

box.appendChild(table);

// Flag count displayed is equal to number of bombs
document.getElementById("counter_value").innerHTML = num_bombs;

// For each bomb, increment numerical value of all surrounding cells
let bombs = document.getElementsByClassName("bombs");
let greatest_cell_value = 0;
for (let i = 0; i < bombs.length; i++) {
    let curr_bomb = bombs[i];
    let bomb_coords = curr_bomb.id.split(',');
    let bomb_x = Number(bomb_coords[0]);
    let bomb_y = Number(bomb_coords[1]);

    // Find top-left and bottom-right corners of surrounding square of bomb to be incremented
    let top_left = [0,0];
    if (bomb_x > 0) {
        top_left[0] = bomb_x - 1;
    }
    if (bomb_y > 0) {
        top_left[1] = bomb_y - 1;
    }

    let bottom_right = [bomb_x, bomb_y]; // Default is farthest corner; if less, will be changed
    if (bomb_x < rows-1) {
        bottom_right[0] = bomb_x + 1;
    }
    if (bomb_y < cols-1) {
        bottom_right[1] = bomb_y + 1;
    }

    // Loop over square formed by the top_left and bottom_right coords
    for (let x = top_left[0]; x < bottom_right[0]+1; x++) {
        for (let y = top_left[1]; y < bottom_right[1]+1; y++) {
            let curr_cell = document.getElementById(`${x},${y}`);
            
            let classification = curr_cell.classList[1]; // either "bombs" or "n0-4"
            if (classification === "bombs") {
                continue; // No value to increment for bomb cells
            }
            
            // Increment value of (class name)
            let new_value = Number(classification.split('n')[1]) + 1;
            curr_cell.classList.remove(classification);
            curr_cell.classList.add(`n${new_value}`);

            // Update greatest cell value
            if (new_value > greatest_cell_value) {
                greatest_cell_value = new_value;
            }
        }
    }
}

// Returns the right cell if it is empty
function getAdjacentRight(cell_obj) {
    let cell_coords = cell_obj.id.split(',');
    let cell_x = Number(cell_coords[0]);
    let cell_y = Number(cell_coords[1]);

    let right = [cell_x, cell_y];
    if (cell_y < cols-1) {
        right[1] = cell_y + 1;
    } else {
        return null; // No cell to right
    }

    // Check that right cell is empty
    let right_cell = document.getElementById(`${right[0]},${right[1]}`);
    if (right_cell.classList[1] !== "n0") {
        return null;
    }

    return right_cell;
}

// Returns the down cell if it is empty
function getAdjacentDown(cell_obj) {
    let cell_coords = cell_obj.id.split(',');
    let cell_x = Number(cell_coords[0]);
    let cell_y = Number(cell_coords[1]);

    let down = [cell_x, cell_y];
    if (cell_x < rows-1) {
        down[0] = cell_x + 1;
    } else {
        return null; // No cell to down
    }

    // Check that down cell is empty
    let down_cell = document.getElementById(`${down[0]},${down[1]}`);
    if (down_cell.classList[1] !== "n0") {
        return null;
    }

    return down_cell;
}

// Returns the up cell if it is empty
function getAdjacentUp(cell_obj) {
    let cell_coords = cell_obj.id.split(',');
    let cell_x = Number(cell_coords[0]);
    let cell_y = Number(cell_coords[1]);

    let up = [cell_x, cell_y];
    if (cell_x > 0) {
        up[0] = cell_x - 1;
    } else {
        return null; // No cell to up
    }

    // Check that up cell is empty
    let up_cell = document.getElementById(`${up[0]},${up[1]}`);
    if (up_cell.classList[1] !== "n0") {
        return null;
    }

    return up_cell;
}

// Returns the left cell if it is empty
function getAdjacentLeft(cell_obj) {
    let cell_coords = cell_obj.id.split(',');
    let cell_x = Number(cell_coords[0]);
    let cell_y = Number(cell_coords[1]);

    let left = [cell_x, cell_y];
    if (cell_y > 0) {
        left[1] = cell_y - 1;
    } else {
        return null; // No cell to left
    }

    // Check that left cell is empty
    let left_cell = document.getElementById(`${left[0]},${left[1]}`);
    if (left_cell.classList[1] !== "n0") {
        return null;
    }

    return left_cell;
}

// Will assign a given group number to this cell and all cells in the same section via recursion
function propagateFromCell(cell, group_num) {
    // Assign the group to the given cell
    cell.classList.add(`group_${group_num}`);

    // Cycle from up, right, down, left and assign group to them
    let up_cell = getAdjacentUp(cell);
    if ((up_cell !== null) && (up_cell.classList[up_cell.classList.length-1].split('_')[0] !== "group")) { // Is empty and not in a group
        propagateFromCell(up_cell, group_num);
    }

    let right_cell = getAdjacentRight(cell);
    if ((right_cell !== null) && (right_cell.classList[right_cell.classList.length-1].split('_')[0] !== "group")) {
        propagateFromCell(right_cell, group_num);
    }

    let down_cell = getAdjacentDown(cell);
    if ((down_cell !== null) && (down_cell.classList[down_cell.classList.length-1].split('_')[0] !== "group")) {
        propagateFromCell(down_cell, group_num);
    }

    let left_cell = getAdjacentLeft(cell);
    if ((left_cell !== null) && (left_cell.classList[left_cell.classList.length-1].split('_')[0] !== "group")) {
        propagateFromCell(left_cell, group_num);
    }
}

// For each remaining empty cell, group into sections
// Format of group classes: 'group_X'
let curr_group_num = 0;
let empty_cells = document.getElementsByClassName('n0');
for (let i = 0; i < empty_cells.length; i++) {
    let curr_cell = empty_cells[i];
    if (curr_cell.classList[curr_cell.classList.length-1].split('_')[0] === "group") {
        continue;
    }
    propagateFromCell(curr_cell, curr_group_num);
    curr_group_num += 1;
}

// This function handles the mechanics of selecting an empty (group) tile
function handleGroupTile(element) {
    let group = element.classList[2]; // Group of tiles to be revealed
    let tiles_in_group = document.getElementsByClassName(group);

    // Loop through each tile in the group and reveal 3x3 square centered at given tile
    for (let i = 0; i < tiles_in_group.length; i++) {
        // Get coords of tile
        let curr_tile = tiles_in_group[i];
        let coords = curr_tile.id.split(',');
        let x = Number(coords[0]);
        let y = Number(coords[1]);

        // Find top-left and bottom-right corners of surrounding square to be revealed
        let top_left = [0,0];
        if (x > 0) {
            top_left[0] = x - 1;
        }
        if (y > 0) {
            top_left[1] = y - 1;
        }

        let bottom_right = [x, y]; // Default is farthest corner; if less, will be changed
        if (x < rows-1) {
            bottom_right[0] = x + 1;
        }
        if (y < cols-1) {
            bottom_right[1] = y + 1;
        }

        // Loop over square formed by the top_left and bottom_right coords
        for (let temp_x = top_left[0]; temp_x < bottom_right[0]+1; temp_x++) {
            for (let temp_y = top_left[1]; temp_y < bottom_right[1]+1; temp_y++) {
                let curr_cell = document.getElementById(`${temp_x},${temp_y}`);  

                // Find what number (or not) to display in cell and style cell
                let classification = curr_cell.classList[1]; // "n0-4" (should not be "bombs")
                let this_group = curr_cell.classList[curr_cell.classList.length-1]; // For not revealing empty tiles from nearby groups

                if ((curr_cell.classList.length === 3) && (this_group !== group)) { // Different group, so skip
                    continue;
                }

                // Remove from list of hidden cells
                if (removeFromHiddenCells(curr_cell.id) === 1) { // Already removed, so skip
                    continue;
                }

                // Check if there is flag on tile to reveal
                if (curr_cell.style.backgroundImage === `url("number_textures/flag.png")`) { // Adjust flag count before removing
                    num_flags += 1;
                }

                // Apply basic styles
                curr_tile.style.backgroundImage = "none";
                curr_cell.style.borderColor = "transparent";
                curr_cell.style.backgroundColor = "rgb(200, 200, 200)";

                if (classification === "n0") { // Do not assign number below
                    continue;
                }

                // Get number of tile and display
                let num = classification.split('n')[1];
                curr_cell.style.backgroundImage = `url(number_textures/${num}.png)`;
            }
        }
    }
    // Update flag count after revealing tiles
    let counter = document.getElementById("counter_value");
    counter.innerHTML = num_flags;
} // END handleGroupTile

// This function handles the mechanics of selecting a bomb tile
function handleBombTile(element) {
    element.style.backgroundImage = `url(number_textures/bombs.png)`;
    element.style.backgroundColor = 'red';

    let table_obj = document.getElementById("mine_table");
    setTimeout(() => {
        table_obj.style.backgroundColor = "lightgrey";

        let cell_objs = document.getElementsByClassName("cells");
        for (let j = 0; j < cell_objs.length; j++) {
            let cur_cell = cell_objs[j];
            cur_cell.style.transform = "scale(0)";
        }
    }, 1000);

    setTimeout(() => {
        table_obj.remove();
        makeTable();
    }, 2000);
} // END handleBombTile

// This function handles the mechanics of selecting a numbered tile
function handleNumberedTile(element) {
    let classes = element.classList;
    let cell_value = classes[1].split('n')[1];

    // Remove from list of hidden cells
    if (removeFromHiddenCells(element.id) === 1) { // Already revealed, so do nothing
        return;
    };

    // Apply basic styles
    element.style.backgroundImage = `url(number_textures/${cell_value}.png)`;
    element.style.borderColor = "transparent";
    element.style.backgroundColor = "rgb(200, 200, 200)";
} // END handleNumberedTile

// This function handles the mechanics of placing or removing a flag on/from a tile
function handleFlagPlacement(element) {
    if (hidden_cells.includes(element.id) === false) { // Cell not hidden, so cannot apply flag
        return;
    }
    let curr_background = element.style.backgroundImage;
    let counter = document.getElementById("counter_value");
    if (curr_background === `url("number_textures/flag.png")`) { // Remove flag
        num_flags += 1;
        counter.innerHTML = num_flags;
        element.style.backgroundImage = "url(number_textures/flag_transparent.png)";

        // Check if placed on bomb
        if (element.classList[1] === "bombs") {
            correct_flags -= 1; // No longer placed on a bomb
        }
    }
    else { // Place flag
        if (num_flags === 0) {return;} // Cannot place any more flags
        num_flags -= 1;
        counter.innerHTML = num_flags;
        element.style.backgroundImage = "url(number_textures/flag.png)";

        // Check if placed on bomb
        if (element.classList[1] === "bombs") {
            correct_flags += 1; 
        }
    }
    // Check win condition
    if (correct_flags === num_bombs) {
        win();
    }
} // END handleFlagPlacement

// The event listener for all cells
const all_cells = document.querySelectorAll(`.cells`);
all_cells.forEach((element) => {
    element.addEventListener('click', () => {
        // Three types of class lists:
        // 1. ["cells", "n1-X"]             (numbered tile)
        // 2. ["cells", "bombs"]            (bomb tile)
        // 3. ["cells", "n0", "group_X"]    (group tile)
        let classes = element.classList;

        if (has_won) {return;} // Do not let user interact with game after they have won

        if (flags_toggled) { // placing flags takes priority over everything
            handleFlagPlacement(element);
        }
        else if (element.style.backgroundImage === `url("number_textures/flag.png")`) { // Trying to reveal flag tile, so don't
            return;
        }
        else if (classes[1] === "bombs") { // bomb tile
            handleBombTile(element);
        }
        else if (classes.length === 3) { // group tile
            handleGroupTile(element);
        }
        else { // numbered tile
            handleNumberedTile(element);
        }
    });
});

// This function is called when all flags have been placed correctly and ends the game
function win() {
    has_won = true;
    let win_box = document.getElementById("play_again");
    win_box.style.display = "flex";
}

// Because JS arrays don't have a convenient 'remove' method...
function removeFromHiddenCells(item) {
    let index = hidden_cells.indexOf(item);
    if (index > -1) { // only splice array when item is found
      hidden_cells.splice(index, 1); // 2nd parameter means remove one item only
      return 0;
    }
    else {
        return 1; // For error handling
    }
}

// Make the table visible
setTimeout(() => {
    let cell_objs = document.getElementsByClassName("cells");
    for (let j = 0; j < cell_objs.length; j++) {
        let cur_cell = cell_objs[j];
        cur_cell.style.transform = "scale(1)";
    }
}, 200);

setTimeout(() => {
    table.style.backgroundColor = "grey";
}, 1200); // This time is the animation time for the 'cells' scale plus time of previous timeout

} // END makeTable

function playAgain() {
    has_won = false;
    document.getElementById("play_again").style.display = "none";

    // The following is just about the same as the code executed by the bomb handler
    let table_obj = document.getElementById("mine_table");
    table_obj.style.backgroundColor = "lightgrey";

    let cell_objs = document.getElementsByClassName("cells");
    for (let j = 0; j < cell_objs.length; j++) {
        let cur_cell = cell_objs[j];
        cur_cell.style.transform = "scale(0)";
    }

    setTimeout(() => {
        table_obj.remove();
        makeTable();
    }, 1000);
}

// Brings the user back to the landing page
function goHome() {
    location.href = "/Landing_Page";
}

makeTable();