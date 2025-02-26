var num_nodes = 0; // used for creating unique IDs for nodes
var adj_lists = {}; // Maps node IDs to a list of node IDs they are connected to
var edge_thickness = 5; // px

const css_styles = getComputedStyle(document.documentElement); // Or any specific element
var edge_thickness = css_styles.getPropertyValue("--edge-thickness").slice(0,-2); // px
var node_size = css_styles.getPropertyValue("--node-size").slice(0,-2); // Includes border

// "Create button" event listener
document.getElementById("create_node_btn").addEventListener("click", function(event) {
    document.getElementById("side_panel_mask").style.display = "flex";
    document.getElementById("mask_text").innerHTML = "&quotESC&quot to cancel";

    // Create and add a new node to the page
    let new_node = document.createElement("div");
    new_node.classList.add("node");
    document.getElementById("page").appendChild(new_node);

    // Set default node position to be on button
    let node_size = new_node.clientWidth;
    new_node.style.top = event.clientY - node_size/2 + 'px';
    new_node.style.left = event.clientX - node_size/2 + 'px';

    // For all nodes on the page, either allow or disallow pointer events
    function setNodePointerEvents(value) {
        let nodes = document.getElementsByClassName("node");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.pointerEvents = value;
        }
    }
    // Don't allow any nodes to be clickable at the moment
    setNodePointerEvents("none");

    // Have node follow cursor for placing
    function mousemove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        new_node.style.top = mouseY - node_size/2 + 'px';
        new_node.style.left = mouseX - node_size/2 + 'px';
    }
    document.addEventListener("mousemove", mousemove);

    // Disable create node action
    function resetCreateAction() {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("mousemove", mousemove);
        document.getElementById("preview_section").removeEventListener("click", click);
        document.getElementById("side_panel_mask").style.display = "none";
        setNodePointerEvents("all");
        new_node.remove();
    }
    // Make preview section clickable
    let placed_node;
    function click(event) {
        placed_node = new_node.cloneNode("deep");
        placed_node.id = `node${num_nodes}`;
        num_nodes += 1;
        placed_node.style.top = event.layerY - node_size/2 + 'px';
        placed_node.style.left = event.layerX - node_size/2 + 'px';
        document.getElementById("preview_section").appendChild(placed_node);
        dragElement(placed_node); // make node draggable
        adj_lists[placed_node.id] = []; // Add node to adjacency lists with default no edges
    }
    document.getElementById("preview_section").addEventListener("click", click);

    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            resetCreateAction();
            num_nodes -= 1;
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

    let adjecent_nodes = adj_lists[e.target.id];
    for (let i = 0; i < adjecent_nodes.length; i++) {
        moveEdge(elmnt, document.getElementById(adjecent_nodes[i]));
    }
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

// Will move the edge between the two given nodes (called when either node is repostioned)
function moveEdge(node1, node2) {
    // Get the edge element
    let edge = document.getElementById(`edge_${node1.id}_${node2.id}`);
    if (edge === null) {
        edge = document.getElementById(`edge_${node2.id}_${node1.id}`);
    }

    let node1_props = node1.getBoundingClientRect();
    let node2_props = node2.getBoundingClientRect();
    let edge_length = calculateDistance(node1_props.x, node1_props.y, node2_props.x, node2_props.y);

    // Calculate the center points of each given node within the preview area
    let node1_X = node1.offsetLeft + node_size/2;
    let node1_Y = node1.offsetTop + node_size/2;
    let node2_X = node2.offsetLeft + node_size/2;
    let node2_Y = node2.offsetTop + node_size/2;

    // Calculate the true center of the edge between the nodes
    let centerX = node1_X + (-1*(node1_X - node2_X)/2);
    let centerY = node1_Y + (-1*(node1_Y - node2_Y)/2);

    // Offset the edge (div) element to have its center centered on the line between the two nodes
    let centerX_offset = centerX - edge_length/2;
    let centerY_offset = centerY - edge_thickness/2;

    // Calculate angle to rotate edge div (currently a flat line)
    // cos(<ang>) = adjacent / hypotenuse
    let angle_factor = node2_Y < node1_Y ? -1 : 1; // Determines whether to rotate clockwise or counter-clockwise
    let adj = (node2_X - centerX);
    let hyp = edge_length/2;
    let angle = angle_factor * Math.acos(adj/hyp); // in radians

    // Translate and rotate the edge into position
    edge.style.top = centerY_offset + 'px';
    edge.style.left = centerX_offset + 'px';
    edge.style.transform = `RotateZ(${angle}rad)`;
}

// Given two node elements, this function will create an edge between them
// Returns the ID of the edge (in the form 'edge_nodeX_nodeY')
function createEdge(node1, node2) {
    // Define new edge length and thickness and fetch node sizes
    let node1_props = node1.getBoundingClientRect();
    let node2_props = node2.getBoundingClientRect();
    let edge_length = calculateDistance(node1_props.x, node1_props.y, node2_props.x, node2_props.y);

    // Create the new edge (div) element
    let preview_box = document.getElementById("preview_section");
    let new_edge = document.createElement("div");
    new_edge.classList.add("edge");
    new_edge.id = `edge_${node1.id}_${node2.id}`;
    new_edge.style.width = edge_length + 'px';
    // new_edge.style.height = edge_thickness + 'px';
    preview_box.appendChild(new_edge);
    
    // Translate and rotate edge to fit between nodes
    moveEdge(node1, node2);

    // Add the edge to the document and return its ID
    return new_edge.id;
}

document.getElementById("create_edge_btn").addEventListener("click", function(event) {
    let start_node = null; // stores the ID of a node
    document.getElementById("side_panel_mask").style.display = "flex";
    document.getElementById("mask_text").innerHTML = "&quotESC&quot to quit";

    let endpoint_node_ids = [];
    let latest_edge_preview = null;
    // Allow every node to be selected
    let nodes = document.getElementsByClassName("node");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("click", selectableForEdge);
    }

    // Resets the preview section to the default edge creation view (no nodes highlighted)
    function toggleOffStartNode(node_id) {
        start_node = null;
        let node = document.getElementById(node_id);
        node.classList.remove("create_edge_start");
        // let end_nodes = document.getElementsByClassName("create_edge_end");
        let end_nodes = adj_lists[node_id];
        for (let i = 0; i < end_nodes.length; i++) {
            let curr_node = document.getElementById(end_nodes[i]);
            curr_node.classList.remove("create_edge_end");
        }
    }

    // Sets the given noed as the start of all created edges and highlights endpoints (all nodes toggleable)
    function toggleOnStartNode(node_id) {
        start_node = node_id;
        let node = document.getElementById(node_id);
        node.classList.add("create_edge_start");
        let adjacencies = adj_lists[node.id];
        for (let i = 0; i < adjacencies.length; i++) { // Iterate through all already-connected nodes
            let curr_node = document.getElementById(adjacencies[i]);
            curr_node.classList.add("create_edge_end");
        }
    }

    // What happens when a node is selected for new edge endpoint
    function selectableForEdge(event) {
        if (event.shiftKey) { // Selected new start point
            if  (start_node === null) { // No start mode currently selected
                toggleOnStartNode(event.target.id);
            }
            else if (event.target.id === start_node) { // Toggle off start node
                toggleOffStartNode(start_node);
            }
            else { // Change start node
                toggleOffStartNode(start_node);
                toggleOnStartNode(event.target.id);
            }
            return;
        }

        // BELOW: Left click with no shift (creates edges)
        if (start_node === null || event.target.id === start_node) { // Cannot create edge to self
            return; 
        }

        // Toggle clicked node ON or OFF (connected or not connected)
        let selected_node = event.target;
        let adjacencies = adj_lists[selected_node.id];
        if (selected_node.classList.contains("create_edge_end")) { // Remove edge
            selected_node.classList.remove("create_edge_end");

            // Remove each node from each other's adjacency lists
            let index = adj_lists[selected_node.id].indexOf(start_node);
            adj_lists[selected_node.id].splice(index, 1);
            index = adj_lists[start_node].indexOf(selected_node.id);
            adj_lists[start_node].splice(index, 1);

            let edge = document.getElementById(`edge_${start_node}_${selected_node.id}`);
            if (edge === null) {
                edge = document.getElementById(`edge_${selected_node.id}_${start_node}`);
            }
            edge.remove();
        }
        else { // Add edge
            selected_node.classList.add("create_edge_end");
            adj_lists[selected_node.id].push(start_node);
            adj_lists[start_node].push(selected_node.id);
            createEdge(document.getElementById(start_node), selected_node);
        }
    }

    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            toggleOffStartNode(start_node);
            let nodes = document.getElementsByClassName("node");
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].removeEventListener("click", selectableForEdge);
            }
            document.removeEventListener("keydown", keydown);
            document.getElementById("side_panel_mask").style.display = "none";
        }
    }
    document.addEventListener("keydown", keydown);
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