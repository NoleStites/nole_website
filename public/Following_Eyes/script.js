// Get CSS vars
const element = document.documentElement; // Or any specific element
const styles = getComputedStyle(element);
const ring_width = styles.getPropertyValue('--ring-width').slice(0, -2);
const largest_ring_size = styles.getPropertyValue('--largest-ring-size').slice(0, -2);
const ring_spacing = styles.getPropertyValue('--ring-spacing').slice(0, -2);

// Adjustable variables
const min_space_between_rings = 3; // Minimum ring-widths of space allowed between any two rings at max stretch
const ring_movement_factor = 0.5; // Lower

// Get viewport dimensions
const viewport_width = window.innerWidth;
const viewport_height = window.innerHeight;

let pupil_list = []; // Dictionaries with the keys 'element', 'cx', 'cy' (center)
let pupils = document.getElementsByClassName("pupil");
for (let i = 0; i < pupils.length; i++) {
    let curr_pupil = pupils[i];
    let properties = curr_pupil.getBoundingClientRect();
    let center_x = properties.x + (properties.width/2);
    let center_y = properties.y + (properties.height/2);
    pupil_list.push({
        'element': curr_pupil,
        'cx': center_x,
        'cy': center_y,
        'width': properties.width
    });
}

document.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (let i = 0; i < pupil_list.length; i++) {
        let curr_pupil = pupil_list[i];
        let rings = curr_pupil['element'].children;
        for (let j = 0; j < rings.length; j++) {
            let curr_ring = rings[j];

            let direction_factor_x = mouseX - curr_pupil['cx'];
            let direction_factor_y = mouseY - curr_pupil['cy'];

            let offset_x = Math.abs(direction_factor_x);
            let offset_y = Math.abs(direction_factor_y);

            let strength_x = offset_x / viewport_height * ring_movement_factor; // 0 -> 1, where 1 is at mouse
            let strength_y = offset_y / viewport_height * ring_movement_factor;

            let to_translate_x = direction_factor_x * strength_x;
            let to_translate_y = direction_factor_y * strength_y;
            let max_offset = (curr_pupil['width'] - curr_ring.offsetWidth)/2 - (j+1)*ring_width - min_space_between_rings*(j+1)*ring_width;

            if (to_translate_x > max_offset || to_translate_x < -1*max_offset) {
                to_translate_x = Math.sign(direction_factor_x)*max_offset;
            }
            if (to_translate_y > max_offset || to_translate_y < -1*max_offset) {
                to_translate_y = Math.sign(direction_factor_y)*max_offset;
            }

            curr_ring.style.transform = `translate(${to_translate_x}px, ${to_translate_y}px)`;
        }
    }
});