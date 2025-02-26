
// "Create button" event listener
document.getElementById("create_node_btn").addEventListener("click", function(event) {
    document.getElementById("side_panel_mask").style.display = "flex";

    // Create and add a new node to the page
    let new_node = document.createElement("div");
    new_node.classList.add("node");
    document.getElementById("page").appendChild(new_node);

    // Set default node position to be on button
    let node_size = new_node.clientWidth;
    new_node.style.top = event.clientY - node_size/2 + 'px';
    new_node.style.left = event.clientX - node_size/2 + 'px';

    // Don't allow any nodes to be clickable at the moment
    setNodePointerEvents("none");

    function setNodePointerEvents(value) {
        let nodes = document.getElementsByClassName("node");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.pointerEvents = value;
        }
    }

    // Have node follow cursor for placing
    function mousemove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        new_node.style.top = mouseY - node_size/2 + 'px';
        new_node.style.left = mouseX - node_size/2 + 'px';
    }
    document.addEventListener("mousemove", mousemove);

    // Make preview section clickable
    function resetCreateAction() {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("mousemove", mousemove);
        document.getElementById("preview_section").removeEventListener("click", click);
        document.getElementById("side_panel_mask").style.display = "none";
        setNodePointerEvents("all");
        new_node.remove();
    }
    let placed_node;
    function click(event) {
        placed_node = new_node.cloneNode("deep");
        placed_node.style.top = event.layerY - node_size/2 + 'px';
        placed_node.style.left = event.layerX - node_size/2 + 'px';
        document.getElementById("preview_section").appendChild(placed_node);
        dragElement(placed_node);
        resetCreateAction();
    }
    document.getElementById("preview_section").addEventListener("click", click);

    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            resetCreateAction();
        }
    }
    document.addEventListener("keydown", keydown);
});

// Make the DIV element draggable:
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let preview_box = document.getElementById("preview_section").getBoundingClientRect();
  let elmnt_props = elmnt.getBoundingClientRect();

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    let new_top = elmnt.offsetTop - pos2;
    let new_left = elmnt.offsetLeft - pos1;

    // Do not let the node leave the preview area
    if (new_top < 0) {new_top = 0;}
    else if (new_top > preview_box.height - elmnt_props.width) {new_top = preview_box.height - elmnt_props.width;}
    if (new_left < 0) {new_left = 0;}
    else if (new_left > preview_box.width - elmnt_props.width) {new_left = preview_box.width - elmnt_props.width;}

    elmnt.style.top = new_top + "px";
    elmnt.style.left = new_left + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Returns the distance between two points
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

document.getElementById("create_edge_btn").addEventListener("click", function(event) {
    let nodes = document.getElementsByClassName("node");
    let node = nodes[0];
    let node_size = node.getBoundingClientRect().width; // Includes border
    
    let node1 = nodes[0].getBoundingClientRect();
    let node2 = nodes[1].getBoundingClientRect();
    let edge_length = calculateDistance(node1.x, node1.y, node2.x, node2.y);
    node1 = nodes[0];
    node2 = nodes[1];

    let edge_thickness = 5;
    let preview_box = document.getElementById("preview_section");
    let new_edge = document.createElement("div");
    new_edge.classList.add("edge");
    new_edge.style.width = edge_length + 'px';
    new_edge.style.height = edge_thickness + 'px';
    // Center line on center of line connecting nodes
    // let directional_factor_X = Math.sign(node1.offsetLeft - node2.offsetLeft);
    // let directional_factor_Y = Math.sign(node1.offsetTop - node2.offsetTop);
    // let centerX = node1.offsetLeft + directional_factor_X*(node1.offsetLeft - node2.offsetLeft)/2;
    // let centerY = node1.offsetTop + directional_factor_Y*(node1.offsetTop - node2.offsetTop)/2;
    
    let node1_X = node.offsetLeft + node_size/2;
    let node1_Y = node.offsetTop + node_size/2;
    console.log("Node1 Center: ", node1_X, node1_Y);
    let node2_X = node2.offsetLeft + node_size/2;
    let node2_Y = node2.offsetTop + node_size/2;
    console.log("Node2 Center: ", node2_X, node2_Y);

    // Calculate the true center of the edge between the nodes
    let centerX = node1_X + (-1*(node1_X - node2_X)/2);
    let centerY = node1_Y + (-1*(node1_Y - node2_Y)/2);

    // Offset the div element to have its center centered on the line between the two nodes
    let centerX_offset = centerX - edge_length/2;
    let centerY_offset = centerY - edge_thickness/2;

    // Calculate angle to rotate edge div
    // cos(<ang>) = adjacent / hypotenuse
    let angle_factor = node2_Y < node1_Y ? -1 : 1; // Determines whether to rotate clockwise or counter-clockwise
    let adj = (node2_X - centerX);
    let hyp = edge_length/2;
    let angle = angle_factor * Math.acos(adj/hyp); // in radians

    new_edge.style.top = centerY_offset + 'px';
    new_edge.style.left = centerX_offset + 'px';
    new_edge.style.transform = `RotateZ(${angle}rad)`;
    preview_box.appendChild(new_edge);
});

// Edge canvas
let canvas = document.getElementById("edge_canvas");

// Set canvas size to fill preview space (cannot use css or else warp)
let preview_box = document.getElementById("preview_section").getBoundingClientRect();
canvas.width = preview_box.width;
canvas.height = preview_box.height;

// const ctx = canvas.getContext('2d');
// ctx.beginPath(); // Start a new drawing path
// ctx.arc(100, 100, 50, 0, 2*Math.PI); // Create the circle arc
// ctx.stroke();