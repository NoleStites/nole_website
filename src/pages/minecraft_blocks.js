import Navbar from "../navbar/navbar";
import Sidepanel from "../minecraft_blocks/Sidepanel";
import '../minecraft_blocks/minecraft_blocks.css'
import { useState, useEffect } from 'react';

function MinecraftBlocks() {
    // State hooks that re-render the necessary components when changed
    const [num_columns, setColumns] = useState(20);
    const [num_rows, setRows] = useState(10);
    const [texture_size, setTextureSize] = useState(40);

    // Helper functions to change the state hooks
    const changeColumns = (new_size) => {
        setColumns(new_size);
    }
    const changeRows = (new_size) => {
        setRows(new_size);
    }
    const changeTextureSize = () => {
        let value = document.getElementById('texture_size_input').value;
        if (value < 20) {
            return;
        }
        setTextureSize(value);
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
                row.push(<div key={j} className="texture_box" style={spot_styles}></div>);
            }
            grid.push(<div key={i} className="flexbox">{row}</div>);
        }
        return grid;
    }

    let texture_grid = make_flex_grid(num_columns, num_rows, texture_size);

    const temp = () => {
        let value = document.getElementById('column_input').value;
        if (value < 1) {
            return;
        }
        console.log(value);
    }

    return (
        <div className="page">
            <Navbar />
            <Sidepanel />
            <div id="buttons">
                <button onClick={() => changeColumns(num_columns+1)}>+Columns</button>
                <button onClick={() => changeRows(num_rows+1)}>+Rows</button>
                <input onChange={() => temp()} type="number" id="column_input" min={1} max={1000}></input>
                {/* Step size below is 4 because the textures are not lined up until the next 4th pixel increase. Odd... */}
                <input onChange={() => changeTextureSize()} type="number" id="texture_size_input" min={20} max={200} step={4}></input>
            </div>
            {texture_grid}
        </div>
    );
}  

export default MinecraftBlocks;