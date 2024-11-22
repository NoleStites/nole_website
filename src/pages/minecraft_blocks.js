import Navbar from "../navbar/navbar";
import Grid from "../minecraft_blocks/Grid";
import '../minecraft_blocks/minecraft_blocks.css'
import { useState, useEffect } from 'react';

function MinecraftBlocks() {
    const [num_columns, setColumns] = useState(8);
    const [num_rows, setRows] = useState(2);

    // Helper function to change the state
    const changeColumns = (new_size) => {
        setColumns(new_size);
    }

    // Helper function to change the state
    const changeRows = (new_size) => {
        setRows(new_size);
    }

    const temp = () => {
        // console.log("Changed!");
        let spots = document.getElementsByClassName("grid_spot");
        console.log(spots);
        let spot = spots[0];
        console.log(spot);
    }

    return (
        <div className="page">
            <Navbar />
            <div id="buttons">
            <button onClick={() => changeColumns(num_columns+1)}>+Columns</button>
            <button onClick={() => changeRows(num_rows+1)}>+Rows</button>
            <input onChange={() => temp()} type="number"></input>
            </div>
            <Grid columns={num_columns} rows={num_rows}/>
        </div>
    );
}  

export default MinecraftBlocks;