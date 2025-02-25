
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
    new_node.style.pointerEvents = "none";

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
        new_node.remove();
    }
    function click(event) {
        let placed_node = new_node.cloneNode("deep");
        resetCreateAction();
        placed_node.style.top = event.layerY - node_size/2 + 'px';
        placed_node.style.left = event.layerX - node_size/2 + 'px';
        placed_node.style.pointerEvents = "all";
        document.getElementById("preview_section").appendChild(placed_node);
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