
function calc_num_rows_and_cols(texture_dimension) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let num_rows = Math.floor(viewportHeight / texture_dimension);
    let num_columns = Math.floor(viewportWidth / texture_dimension);

    return {'columns':num_columns, 'rows':num_rows};
}

// Returns a value between 0 and max (exclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const cell_size = 50;
const border_size = Math.ceil(cell_size*(4/50)); // Because 4px was good for cell_size 50, use as ration for other sizes
const border_spacing = Math.ceil(cell_size*(3/50));
const table_dimensions = calc_num_rows_and_cols(cell_size + (2*border_size) + border_spacing);
const rows = table_dimensions['rows'];
const cols = table_dimensions['columns'];
let max_bombs = Math.floor(Math.sqrt(rows*cols)) + 10 // square root of the total number of cells
let chance_for_bomb = max_bombs / (rows*cols);

let box = document.getElementById("flex_box");
let table = document.createElement("table");
table.style.borderSpacing = `${border_spacing}px`;

// Create grid and assign bombs
for (let i = 0; i < rows; i++) {
    let new_row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
        let new_cell = document.createElement("td");
        new_cell.classList.add("cells");
        new_cell.id = `${i},${j}`; // Every table cell is given a coordinate for future reference
        new_cell.style.width = `${cell_size}px`;
        new_cell.style.height = `${cell_size}px`;
        new_cell.style.minWidth = `${cell_size}px`;
        new_cell.style.minHeight = `${cell_size}px`;
        new_cell.style.border = `${border_size}px outset rgb(205, 205, 205)`;
        // new_cell.innerHTML = new_cell.id;
        if (Math.random() < chance_for_bomb) { // Math.random returns value 0 to 1
            new_cell.classList.add("bombs");
        } else {
            new_cell.classList.add("n0"); // to be incremented. Zero means no value in cell
        }
        new_row.appendChild(new_cell);
    }
    table.appendChild(new_row);
}

box.appendChild(table);

// For each bomb, increment numerical value of all surrounding cells
let bombs = document.getElementsByClassName("bombs");
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
    cell.innerHTML = group_num;

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

for (let i = 0; i < curr_group_num; i++) {
    const elements = document.querySelectorAll(`.group_${i}`);

    // Add a click event listener to each element
    elements.forEach((element) => {
    element.addEventListener('click', () => {
        // Apply style to all elements in the class
        elements.forEach((el) => {
            el.style.backgroundColor = 'green'; // Example style
        });
    });
    });
}