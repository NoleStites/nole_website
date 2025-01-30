/* 
    HOW TO USE
    1. Import this script into your HTML file with the 'defer' attribute
        Ex: <script src="bubble.js" defer></script>
    2. Add the class "bubble_background" to any element in HTML that you want
    
    :: That's it!

    NOTE 1: do not apply the "bubble_background" class to two overlapping elements
            Ex: to a div and the button inside it

    NOTE 2: this script will set 'overflow: hidden' and 'position: relative' 
            to elements assigned with the class in Step 2. Make sure this does
            not mess with your site.

    :: Feel free to change any variables in the section below this comment to customize the bubbles
*/

// === CHANGEABLE VARIABLES ===
const bubbleSpawnSpeed = 50; // Decrease this value to spawn bubbles faster
const bubble_min_size = 30; // Minimum bubble size in pixels
const bubble_max_size = 35; 
const bubble_min_speed = 8; // Lower value => faster
const bubble_max_speed = 10;
const bubbleStyles = {
    border: "1px solid rgb(0, 92, 153)",
    backgroundColor: "rgba(0, 112, 156, 0.363)"
};
// === END CHANGEABLE VARIABLES ===

// Returns a random integer between two given values (inclusive)
function randIntBetween(a, b) {
    return (Math.floor(Math.random() * b) + a);
}

// Moves the element with the given 'id' to the top value of 'destination' pixels
function moveBubble(id, destination) {
    document.getElementById(`${id}`).style.top = `${destination}px`;
}

// Spawn a bubble element in the given 'element_obj'
function spawnBubble(element_obj) {
    const bubble_size = randIntBetween(bubble_min_size, bubble_max_size);
    const speed_factor = randIntBetween(bubble_min_speed, bubble_max_speed);
    const transition_dur = speed_factor / 10; // Transition speed based on speed factor

    let element_w = element_obj.offsetWidth;
    let element_h = element_obj.offsetHeight;

    const bubble_spawn_offset = randIntBetween(-(bubble_size/2), element_w-(bubble_size/2)); // Spawn at a random point along bottom of 'element_obj'
    const id = Date.now(); // unique id based off of current time tick

    // Create and style a new bubble element
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.id = `${id}`;
    
    let b = bubble.style;
    b.position = "absolute";
    b.width = `${bubble_size}px`;
    b.aspectRatio = "1/1";
    b.top = `${element_h}px`; // Spawn below bottom of element to float up
    b.left = `${bubble_spawn_offset}px`;
    b.transitionDuration = `${transition_dur}s`;
    b.transitionTimingFunction = "linear";
    b.transitionProperty = "top";
    b.borderRadius = "50%";
    b.border = bubbleStyles.border;
    b.backgroundColor = bubbleStyles.backgroundColor;

    // Put the new bubble in the element (now displayed on webpage)
    element_obj.appendChild(bubble);

    // After a buffer time of 100ms, tell bubble to move up to top of 'element_obj'
    setTimeout(function() {
        moveBubble(id, -bubble_size);
        setTimeout(function() {
            bubble.parentNode.removeChild(bubble);
        }, transition_dur*1000); // Time is in milliseconds, so convert s -> ms
    }, 100);
} // END spawnBubble

// Start the bubble loop
var bubbleInterval;
function beginBubbles(element) {
    bubbleInterval = setInterval(function() {
        spawnBubble(element);
    }, bubbleSpawnSpeed);
}
// Stop the bubble loop
function endBubbles() {
    clearInterval(bubbleInterval);
}

// Add a hover event listener for every element with "bubble_background" class
let bubble_backs = document.getElementsByClassName("bubble_background");
for (let i = 0; i < bubble_backs.length; i++) {
    let el = bubble_backs[i];
    el.style.overflow = "hidden"; // Do not show bubbles outside element
    el.style.position = "relative"; // Allows bubbles to be positioned relative to element, not webpage (top:0, left:0 is now el top-left, not top-left of webpage)
    el.addEventListener("mouseover", function() {
        beginBubbles(el);
    });
    el.addEventListener("mouseout", function() {
        endBubbles();
    });
}