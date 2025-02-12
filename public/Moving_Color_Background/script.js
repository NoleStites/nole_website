// Returns a random integer between two given values (inclusive)
function randIntBetween(a, b) {
    return (Math.floor(Math.random() * b) + a);
}

// Returns a random rgb string value
function randomColor() {
    return `rgb(${randIntBetween(0, 255)}, ${randIntBetween(0, 255)}, ${randIntBetween(0, 255)})`;
}

// 1. Get screen dimensions
let vw = window.innerWidth;
let vh = window.innerHeight;

// 2. Calculate number of columns and rows to fill screen
const col_row_size = 100; // in pixels
const tile_opacity = 0.3;
const num_cols = Math.ceil(vw / col_row_size);
const num_rows = Math.ceil(vh / col_row_size);

// 3. Create columns
let col_box = document.getElementById("column_flex");
let prev_duration = 0;
for (let i = 0; i < num_cols; i++) {
    let new_col = document.createElement("div");
    
    // Basic styling
    new_col.classList.add("col");
    new_col.style.width = col_row_size + 'px';
    new_col.style.opacity = `${tile_opacity}`;

    // Find an animation duration not equal to the previous column
    let duration = randIntBetween(5, 12);
    while (duration === prev_duration) {duration = randIntBetween(3, 12);}
    prev_duration = duration;
    new_col.style.animationDuration = `${duration}s`;

    // Create random-colored stripes
    let c1 = randomColor();
    let c2 = randomColor();
    let c3 = randomColor();
    new_col.style.backgroundImage = `repeating-linear-gradient(
        ${c1},
        ${c1} ${col_row_size}px,
        ${c2} ${col_row_size}px,
        ${c2} ${col_row_size*2}px,
        ${c3} ${col_row_size*2}px,
        ${c3} ${col_row_size*3}px
    )`;

    // Add the completed column to the box
    col_box.appendChild(new_col);
}

// 4. Create rows
let row_box = document.getElementById("row_flex");
prev_duration = 0;
for (let i = 0; i < num_rows; i++) {
    let new_row = document.createElement("div");

    // Basic styling
    new_row.classList.add("row");
    new_row.style.height = col_row_size + 'px';
    new_row.style.opacity = `${tile_opacity}`;

    // Find an animation duration not equal to the previous column
    let duration = randIntBetween(5, 12);
    while (duration === prev_duration) {duration = randIntBetween(3, 12);}
    prev_duration = duration;
    new_row.style.animationDuration = `${duration}s`;

    // Create random-colored stripes
    let c1 = randomColor();
    let c2 = randomColor();
    let c3 = randomColor();
    new_row.style.backgroundImage = `repeating-linear-gradient(
        90deg,
        ${c1},
        ${c1} ${col_row_size}px,
        ${c2} ${col_row_size}px,
        ${c2} ${col_row_size*2}px,
        ${c3} ${col_row_size*2}px,
        ${c3} ${col_row_size*3}px
    )`;

    // Add the completed row to the box
    row_box.appendChild(new_row);
}