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
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
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

    var textures = importAll(require.context('../minecraft_blocks/textures', false, /\.(png|jpe?g|svg|webp)$/));
    let texture_names = Object.keys(textures);

    /* This function loops through the grid and assigns a random texture to each spot.

    PARAMS: chosen_textures
    A list of textures chosen by the user. Each texture is represented by a 
    string of the filename (ex: 'Block_of_Emerald.webp') which doubles as the
    key to use to access the texture in the 'textures' dict. */
    const generate = (chosen_textures) => {
        // First, remove borders from each grid_spot
        let boxes = document.getElementsByClassName('texture_box');
        for (let i = 0; i < boxes.length; i++) {
            let curr_box = boxes[i];
            curr_box.style.boxShadow = '0px 0px rgba(0,0,0,0)';
            curr_box.style.backgroundColor = 'rgb(29, 29, 29)';
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
                diagonal_spot.style.backgroundImage = `url(${textures[random_texture]})`;
            }
            }, i*speed);
        }
    }

    let texture_grid = make_flex_grid(num_columns, num_rows, texture_size);

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
                    <button onClick={() => generate(texture_names)}>Generate</button>
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