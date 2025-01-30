// Access CSS vars
var r = document.querySelector(':root');
var rs = getComputedStyle(r);

var hexagon_size = rs.getPropertyValue('--hexagon-size');
hexagon_size = Number(hexagon_size.split('px')[0]);
var hexagon_border_size = rs.getPropertyValue('--hexagon-border-size');
hexagon_border_size = Number(hexagon_border_size.split('px')[0]);
var outer_hexagon_size = hexagon_size + hexagon_border_size;

console.log(`hexagon_size: ${hexagon_size}`);
console.log(`hexagon_border_size: ${hexagon_border_size}`);
console.log(`outer_hexagon_size: ${outer_hexagon_size}`);

// Get page elements
const container = document.getElementById("page");
const content = document.getElementById("flex_box");

const num_columns = Math.ceil(window.innerWidth / (0.75*outer_hexagon_size));
const num_rows = Math.ceil(window.innerHeight / (outer_hexagon_size * Math.sqrt(3)/2));

for (let i = 0; i < num_columns; i++) {
  let new_column = document.createElement("div");
  new_column.id = `col_${i}`;
  new_column.classList.add("flex_column");
  new_column.style.left = `${((3*outer_hexagon_size)/4 * i) - (outer_hexagon_size/4)}px`;

  let num_hexes = num_rows;
  if (i % 2 !== 0) {num_hexes = num_hexes+1;}

  for (let j = 0; j < num_hexes; j++) {
    let hex_border = document.createElement("div");
    hex_border.classList.add("hex_border");
    let hexagon = document.createElement("div");
    hexagon.classList.add("hexagon");
    hex_border.appendChild(hexagon);
    new_column.appendChild(hex_border);
  }

  content.appendChild(new_column);
}

// function randomizeColors() {
//   let hexes = document.getElementsByClassName("hexagon");
//   for (let i = 0; i < hexes.length; i++) {
//     let hex = hexes[i];
//     hex.style.backgroundColor = `rgba(150, 0, 0, ${Math.random()})`;
//   }
// }

// setInterval(randomizeColors, 2000);