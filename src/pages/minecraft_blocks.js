import Navbar from "../navbar/navbar";
import '../minecraft_blocks/minecraft_blocks.css';
import '../minecraft_blocks/Sidepanel.css';
import { useState } from 'react';

function MinecraftBlocks() {
    // State hooks that re-render the necessary components when changed
    const [num_columns, setColumns] = useState(10);
    const [num_rows, setRows] = useState(10);
    const [texture_size, setTextureSize] = useState(40);
    const [speed, setSpeed] = useState(100);
    const [selection, setSelection] = useState({});

    // Helper functions to change the state hooks
    const changeColumns = (new_size) => {
        let value = document.getElementById('column_input').value;
        if (value < 1) {
            return;
        }
        setColumns(value);
    }
    const changeRows = () => {
        let value = document.getElementById('row_input').value;
        if (value < 1) {
            return;
        }
        setRows(value);
    }
    const changeTextureSize = () => {
        let value = document.getElementById('texture_size_input').value;
        if (value < 20 || value % 4 !== 0) {
            return;
        }
        setTextureSize(value);
    }

    const changeSpeed = () => {
        let value = document.getElementById('speed_input').value;
        setSpeed(value);
    }

    // Makes a flex object for each row, populated with 'columns'
    // number of texture_boxes that are all of size texture_size
    // Returns the entire grid as a list object.
    function make_flex_grid(columns, rows, texture_size) {
        let grid = [];
        let spot_styles = {
            minHeight: texture_size+'px',
            minWidth: texture_size+'px'
        }

        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                row.push(<div key={j} className={`texture_box diagonal_${j+i}`} style={spot_styles}></div>);
            }
            grid.push(<div key={i} className="flexbox">{row}</div>);
        }
        return grid;
    }

    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    function openNav() {
        document.getElementById("mySidebar").style.width = "350px";
        document.getElementById("main").style.marginLeft = "350px";
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    // Import all textures and store the media in a 'textures' dictionary
    // Where the key is the file name (ex: 'Block_of_Emerald.webp').
    function importAll(r) {
        let textures = {};
        r.keys().map((item, index) => { textures[item.replace('./', '')] = r(item); });
        return textures;
    }

    var texture_types = ['animal', 'building', 'ore', 'plant', 'redstone', 'sediment', 'stone', 'utility', 'wood'];
    var textures = {
        'animal': importAll(require.context('../minecraft_blocks/textures/animal', false, /\.(png|jpe?g|svg|webp)$/)),
        'building': importAll(require.context('../minecraft_blocks/textures/building', false, /\.(png|jpe?g|svg|webp)$/)),
        'ore': importAll(require.context('../minecraft_blocks/textures/ore', false, /\.(png|jpe?g|svg|webp)$/)),
        'plant': importAll(require.context('../minecraft_blocks/textures/plant', false, /\.(png|jpe?g|svg|webp)$/)),
        'redstone': importAll(require.context('../minecraft_blocks/textures/redstone', false, /\.(png|jpe?g|svg|webp)$/)),
        'sediment': importAll(require.context('../minecraft_blocks/textures/sediment', false, /\.(png|jpe?g|svg|webp)$/)),
        'stone': importAll(require.context('../minecraft_blocks/textures/stone', false, /\.(png|jpe?g|svg|webp)$/)),
        'utility': importAll(require.context('../minecraft_blocks/textures/utility', false, /\.(png|jpe?g|svg|webp)$/)),
        'wood': importAll(require.context('../minecraft_blocks/textures/wood', false, /\.(png|jpe?g|svg|webp)$/)),
    }; // Key is texture_type string, value is dict mapping file names to url

    // Helper to remove items from selection dictionary
    function remove_selection(box_id) {
        // Uncheck the box
        let check_id = box_id+'_check';
        let check = document.getElementById(check_id);
        check.checked = false;

        // Remove the green background color
        let box = document.getElementById(box_id);
        box.style.backgroundColor = 'rgb(29, 29, 29)';

        let temp_dict = selection;
        delete temp_dict[box_id];

        setSelection(temp_dict);
        // console.log(selection);
    }

    // Helper to add items to selection dictionary
    const add_selection = (box_id) => {
        let box = document.getElementById(box_id);
        let text_type = box.classList[1]; // 'animal', 'stone', etc.
        let url = textures[text_type][box_id];

        setSelection((prevSelections) => ({ ...prevSelections, [box_id]: url }));

        let check_id = box_id+'_check';
        let check_obj = document.getElementById(check_id);
        check_obj.checked = true;
        box.style.backgroundColor = 'green';
        // console.log(selection);
    }

    const handle_selection = (box_id) => {
        let check_id = box_id+'_check';
        let check_obj = document.getElementById(check_id);
        let isChecked = check_obj.checked;

        if (isChecked) {
            add_selection(box_id);
        } else {
            remove_selection(box_id);
        }
    }

    const clear_texture_selections = () => {
        let check_boxes = document.getElementsByClassName('texture_checks');
        for (let i = 0; i < check_boxes.length; i++) {
            let curr_check = check_boxes[i];
            if (curr_check.checked) {
                let box_id = curr_check.id.split('_check')[0];
                remove_selection(box_id);
            }
        }
    }

    const select_all_textures = () => {
        let check_boxes = document.getElementsByClassName('texture_checks');
        for (let i = 0; i < check_boxes.length; i++) {
            let curr_check = check_boxes[i];
            if (!curr_check.checked) {
                let box_id = curr_check.id.split('_check')[0];
                add_selection(box_id);
            }
        }
    }

    // Return the HTML for the given texture type section
    function make_texture_grid(texture_type) {
        let curr_t = textures[texture_type];
        let texture_names = Object.keys(curr_t);
        let formatted_string = texture_type[0].toUpperCase() + texture_type.substring(1, texture_type.length);
        let grid = [<h3 key={-1} className="texture_section_title">{formatted_string}</h3>];
        for (let i = 0; i < texture_names.length; i++) {
            let check_id = texture_names[i]+'_check';
            let class_name = "texture_checkbox " + texture_type; 
            grid.push(<div key={i} id={texture_names[i]} className={class_name} style={{ 'backgroundImage': `url(${curr_t[texture_names[i]]})` }}>
                <input className='texture_checks' id={check_id} type="checkbox" onChange={() => handle_selection(texture_names[i])}></input>
            </div>);
        }
        return grid;
    }

    // Returns HTML for all texture type sections
    function make_grids(texture_type_names) {
        let grid = [];
        for (let i = 0; i < texture_type_names.length; i++) {
            let curr_type = texture_type_names[i];
            grid.push(make_texture_grid(curr_type));
        }
        return grid;
    }

    /* This function loops through the grid and assigns a random texture to each spot.

    PARAMS: chosen_textures
    A list of textures chosen by the user. Each texture is represented by a 
    string of the filename (ex: 'Block_of_Emerald.webp') which doubles as the
    key to use to access the texture in the 'textures' dict. */
    const generate = () => {
        let chosen_textures = Object.keys(selection);
        // console.log(chosen_textures);
        
        if (chosen_textures.length === 0) {
            return; // No textures chosen
        }

        // First, remove borders from each grid_spot
        let boxes = document.getElementsByClassName('texture_box');
        if (speed > 0) { // Only for non-instant generation
            for (let i = 0; i < boxes.length; i++) {
                let curr_box = boxes[i];
                curr_box.style.backgroundImage = 'none';
                curr_box.style.boxShadow = '0px 0px rgba(0,0,0,0)';
                curr_box.style.backgroundColor = 'rgb(29, 29, 29)';
                curr_box.style.backgroundSize = '0%';
            }
        }

        let num_textures = chosen_textures.length;
        let num_diagonals = num_columns + num_rows - 1;

        // Loop through each diagonal to generate textures with time delay
        for (let i = 0; i < num_diagonals; i++) {
            let curr_diagonal = document.getElementsByClassName("diagonal_"+i);
            // Loop through each grid_spot in the current diagonal and assign texture
            setTimeout(() => {
            for (let j = 0; j < curr_diagonal.length; j++) {
                let diagonal_spot = curr_diagonal[j];
                // Choose a random texture from the given list of textures
                let random_index = Math.floor(Math.random() * num_textures);
                let random_texture = chosen_textures[random_index];
                diagonal_spot.style.backgroundImage = `url(${selection[random_texture]})`;
                diagonal_spot.style.backgroundSize = '100%';
            }
            }, i*speed);
        }
    }

    let texture_grid = make_flex_grid(num_columns, num_rows, texture_size);
    let texture_panel = make_grids(texture_types); // Returns HTML for all texture sections

    return (
        <div className="page">
            <Navbar />

            {/* SIDEBAR */}
            <div id="mySidebar" className="sidebar">
                <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                <div id="buttons">
                    <label htmlFor="column_input" className="sidepanel_input_label">Column Count: </label>
                    <input onChange={() => changeColumns(num_columns+1)} id="column_input" type="number" min={1} max={200} placeholder={num_columns}></input><br />
                    <label htmlFor="row_input" className="sidepanel_input_label">Row Count: </label>
                    <input onChange={() => changeRows(num_rows+1)} id="row_input" type="number" min={1} max={200} placeholder={num_rows}></input><br />
                    {/* Step size below is 4 because the textures are not lined up until the next 4th pixel increase. Odd... */}
                    <label htmlFor="texture_size_input" className="sidepanel_input_label">Texture Size: </label>
                    <input onChange={() => changeTextureSize()} type="number" id="texture_size_input" min={20} max={200} step={4} placeholder={texture_size}></input><br />
                    <label htmlFor="speed_input" className="sidepanel_input_label">Generation Speed: </label>
                    <input onChange={() => changeSpeed()} type="range" id="speed_input" min={0} max={500} step={10} value={speed}></input><br />
                    <button onClick={() => generate()}>Generate</button>
                    {/* <button onClick={() => clear_screen()}>Clear Screen</button> */}
                </div>
                <div id="texture_section">
                    <div id="texture_flex">
                        <button onClick={() => clear_texture_selections()}>Clear Selection</button>
                        <button onClick={() => select_all_textures()}>Select All</button>
                        {texture_panel} {/* This represents ALL textures */}
                    </div>
                </div>
            </div>
            <div id="main">
                <button className="openbtn" onClick={openNav}>&#9776; Open Sidebar</button>
            </div>  
            {/* END SIDEBAR */}
            
            {texture_grid}
        </div>
    );
}  

export default MinecraftBlocks;