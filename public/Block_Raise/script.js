let rows = 5;
let cols = 9;

let box = document.getElementById("flex_box");
let table = document.createElement("table");

for (let i = 0; i < rows; i++) {
    let new_row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
        let new_cell = document.createElement("td");
        new_cell.classList.add("cells");
        new_row.appendChild(new_cell);
    }
    table.appendChild(new_row);
}

box.appendChild(table);