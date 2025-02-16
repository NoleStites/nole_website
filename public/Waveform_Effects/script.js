
// Fetch CSS wave styles
const element = document.documentElement;
const styles = getComputedStyle(element);
const wave_width = Number(styles.getPropertyValue('--wave-width').slice(0,-2));
const wave_gap = Number(styles.getPropertyValue('--wave-gap').slice(0,-2));

// Create divs for each wave segment to fit inside the give class' div
function initializeWaves(wave_box_id, new_wave_classname) {
    let sound_wave_box = document.getElementById(wave_box_id);
    const max_wave_height = sound_wave_box.offsetHeight;
    const wave_box_width = sound_wave_box.offsetWidth;

    // Calculate number of waves that can fit in the box
    let width_minus_first_wave = wave_box_width - wave_width;
    const max_num_waves = 1 + Math.floor(width_minus_first_wave / (wave_width + wave_gap));

    // Initialize sound waves
    for (let i = 0; i < max_num_waves; i++) {
        let new_wave = document.createElement("div");
        new_wave.classList.add("wave"); // What all waves have in common
        new_wave.classList.add(new_wave_classname);
        sound_wave_box.appendChild(new_wave);
    }
}

/*=================
      DEMO A
=================*/
// Returns a random integer between two given values (inclusive)
function randIntBetween(a, b) {
    return (Math.floor(Math.random() * b) + a);
}

// Assigns a new, random height to each wave segment
function randomizeWaves() {
    let sound_wave_box = document.getElementById("demo_A");
    const max_wave_height = sound_wave_box.offsetHeight;

    let waves = document.getElementsByClassName("demo_A_wave");
    for (let i = 0; i < waves.length; i++) {
        let curr_wave = waves[i];
        let new_height = randIntBetween(wave_width, max_wave_height);
        curr_wave.style.height = new_height + 'px';
    }
}

initializeWaves("demo_A", "demo_A_wave");
randomizeWaves()
setInterval(randomizeWaves, 1000);

/*=================
      DEMO B
=================*/
initializeWaves("demo_B", "demo_B_wave");
let waves = document.getElementsByClassName("demo_B_wave");
let sound_wave_box = document.getElementById("demo_B");
const demo_B_max_wave_height = sound_wave_box.offsetHeight;

document.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (let i = 0; i < waves.length; i++) {
        let curr_wave = waves[i];
        let wave_props = curr_wave.getBoundingClientRect();
        let distance_to_pointer = Math.abs(mouseX - wave_props.left);
        let normalized_distance = distance_to_pointer / window.innerWidth;

        // 0 => max-height, 1 => no height
        // y = x^2
        let new_height = demo_B_max_wave_height - (normalized_distance * demo_B_max_wave_height)**1.75;
        if (new_height < 1) { // Solve the artifact reminants problem
            new_height = 0;
        }
        curr_wave.style.height = new_height + 'px';
    }
});