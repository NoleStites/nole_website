// Fetch canvas properties
var c = document.getElementById("imageCanvas");
var ctx = c.getContext("2d");
var width = c.width; // In pixels, excluding border of canvas
var height = c.height; // ""

// Called by a button press. Generates a new, random image in canvas
function generateNewImage() {
    let newImageData = ctx.createImageData(width, height);
    let data = newImageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = randIntBetween(0, 255); // red
        data[i + 1] = randIntBetween(0, 255); // green
        data[i + 2] = randIntBetween(0, 255); // blue
        data[i + 3] = 255; // alpha
    }
    ctx.putImageData(newImageData, 0, 0); // Draw new pixels starting from top left corner (0,0)
}

// Returns a random integer between two given values (inclusive)
function randIntBetween(a, b) {
    return (Math.floor(Math.random() * b) + a);
}

// Start the bubble loop
var loopSpeed = 1000;
var generateInterval;
function startLoop() {
    generateInterval = setInterval(generateNewImage, loopSpeed);
}
// Stop the bubble loop
function stopLoop() {
    clearInterval(generateInterval);
    generateInterval = null;
}

var speedVal = document.getElementById("speed_value");
var slider = document.getElementById("speedSlider");
slider.value = 2;
slider.oninput = function() {
    speedVal.innerHTML = this.value / 2;
    loopSpeed = this.value * 500;
    if (generateInterval) {
        stopLoop();
        startLoop();
    }
} 



