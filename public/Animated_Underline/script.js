/*
    DESCRIPTION:
    This file contains the functionality responible
    for applying a hover effect to any text element
    (h1, span, etc.) that causes a customizable 
    (gradient) underline to be drawn in.

    HOW TO USE:
    1. Import this script into the head of your HTML document
       with 'defer' set.
    2. Apply the classname "animate_underline" to elements
       in your document that should receive the effect
    3. Customize the underline style and speed in the 
       "CUSTOMIZABLE VARIABLES" section below this comment

    NOTES:
        Padding:
            - The underline length will include any left/right padding
            - The underline will be at the height of the bottom padding
              by default, but can be adjusted below
        Margin:
            - All margins on the element are ignored
*/

// CUSTOMIZABLE VARIABLES
const underline_width = "4px";
const underline_style = "solid";
const underline_colors = [ // Will be displayed left to right. One color is OK
    "cyan",
    "blue"
];
const underline_height_offset = "0px"; // pos(+) => raise; neg(-) => lower
const animation_speed = "0.5s"; // How fast the text is underlined

// Apply underline properties and animation to all
// elements with the classname "animate_underline"
let underline_elements = document.getElementsByClassName("animate_underline");
for (let i = 0; i < underline_elements.length; i++) {
    let el = underline_elements[i];
    el.style.position = "relative";

    // Initialize the underline element
    let underline_box = document.createElement("div");
    underline_box.style.position = "absolute";
    underline_box.style.left = 0;
    underline_box.style.width = "0%";

    // Set underline properties
    let color_list_string = underline_colors.length === 1 ? underline_colors[0]+',' : '';
    for (const color of underline_colors) {
        color_list_string += (color + ',');
    }
    color_list_string = color_list_string.slice(0,-1);

    underline_box.style.borderTopWidth = underline_width;
    underline_box.style.borderTopStyle = underline_style;
    underline_box.style.borderTopColor = "transparent";
    underline_box.style.bottom = underline_height_offset;
    underline_box.style.borderImage = `linear-gradient(to right, ${color_list_string})`;
    underline_box.style.borderImageSlice = "1";

    // Set transition properties
    underline_box.style.transitionProperty = "width";
    underline_box.style.transitionDuration = animation_speed;

    el.appendChild(underline_box);

    // Apply hover effect to underlined element
    el.addEventListener("mouseover", function () {
        underline_box.style.width = "100%";
    })
    el.addEventListener("mouseout", function () {
        underline_box.style.width = "0%";
    })
}