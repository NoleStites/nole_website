import Navbar from "../navbar/navbar";
import styles from "../slide_puzzle/slide_puzzle.module.css"

// Global vars
let table_size = 3
let empty_spot_id = "2_2"; // Changed by the handleKeyPress function; starts as 2_2 (id) always.

function importAll(r) {
    let textures = {};
    r.keys().map((item, index) => { textures[item.replace('./', '')] = r(item); return 0;});
    return textures;
}

function makeTable(size) {
    // Makes and returns a square table of {size} size
    let myTable = [];
    let textures = importAll(require.context('../slide_puzzle/temp_textures', false, /\.(png|jpe?g|svg|webp)$/));

    let counter = 0;
    for (let i = 0; i < size; i++) {
        let myRow = [];
        for (let j = 0; j < size; j++) {
            let curr_texture = textures[`t${i}_${j}.webp`];
            counter += 1;
            if (counter !== size*size) {
                // myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`} style={{ backgroundImage: `url(${curr_texture}` }}>{`${i}_${j}`}</td>); // key= i_j
                myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`} style={{ backgroundImage: `url(${curr_texture}` }}></td>); // key= i_j
            } else {
                myRow.push(<td id={`${i}_${j}`} key={`${i}_${j}`}></td>);
            }
        }
        myTable.push(<tr key={i}>{myRow}</tr>);
    }
    myTable = <table><tbody>{myTable}</tbody></table>;
    return myTable;
}

let already_pressed = false;
function handleKeyPress(key) { // TODO: Try to access the 'empty_spot' tile
    // To avoid the double function call problem
    if (already_pressed) {
        already_pressed = false;
        return;
    } else {
        already_pressed = true;
    }
    
    // Do not execute function if other keys are pressed
    let valid_keys = ['w', 'a', 's', 'd'];
    if (!valid_keys.includes(key)) {return;}

    let empty_spot = document.getElementById(empty_spot_id);
    let empty_x_y = empty_spot_id.split('_');
    let empty_x = parseInt(empty_x_y[0]); // Convert to int, too
    let empty_y = parseInt(empty_x_y[1]);

    if (key === 'w') {
        if (empty_x == table_size-1) {return;} // No piece below empty to move up

        // Get the right spot details
        let down_id = `${empty_x+1}_${empty_y}`;
        let down_spot = document.getElementById(down_id);
        
        // Transfer the texture from right to left
        empty_spot.style.backgroundImage = down_spot.style.backgroundImage;
        down_spot.style.backgroundImage = 'none';
        
        // Update the empty spot
        empty_spot_id = down_id;
    } 
    else if (key === 'a') {
        if (empty_y == table_size-1) {return;} // No piece right of empty to move left

        // Get the right spot details
        let right_id = `${empty_x}_${empty_y+1}`;
        let right_spot = document.getElementById(right_id);
        
        // Transfer the texture from right to left
        empty_spot.style.backgroundImage = right_spot.style.backgroundImage;
        right_spot.style.backgroundImage = 'none';
        
        // Update the empty spot
        empty_spot_id = right_id;
    } 
    else if (key === 's') {
        if (empty_x == 0) {return;} // No piece above empty to move down

        // Get the right spot details
        let up_id = `${empty_x-1}_${empty_y}`;
        let up_spot = document.getElementById(up_id);
        
        // Transfer the texture from right to left
        empty_spot.style.backgroundImage = up_spot.style.backgroundImage;
        up_spot.style.backgroundImage = 'none';
        
        // Update the empty spot
        empty_spot_id = up_id;
    } 
    else if (key === 'd') {
        if (empty_y == 0) {return;} // No piece left of empty to move right
        
        // Get the left spot details
        let left_id = `${empty_x}_${empty_y-1}`;
        let left_spot = document.getElementById(left_id);
        
        // Transfer the texture from left to right
        empty_spot.style.backgroundImage = left_spot.style.backgroundImage;
        left_spot.style.backgroundImage = 'none';
        
        // Update the empty spot
        empty_spot_id = left_id;
    }
}

function SlidePuzzle() {
    document.addEventListener('keydown', function(event){
        handleKeyPress(event.key);
    })

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.flex_body}>
                {makeTable(table_size)}
            </div>
        </div>
    )
}

export default SlidePuzzle;