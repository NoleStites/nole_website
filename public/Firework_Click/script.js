
// Returns a random integer between two given values (inclusive)
function randIntBetween(a, b) {
    return (Math.floor(Math.random() * b) + a);
}

// Returns a new div element object styled as a particle
function createNewParticle(particleDiameter, backgroundColor, animationSpeed, start, end) {
    let newParticle = document.createElement("div");
    newParticle.classList.add("clickParticle");
    newParticle.style.width = particleDiameter+"px";
    newParticle.style.top = `${start[1]}px`;
    newParticle.style.left = `${start[0]}px`;
    newParticle.animate([
        {transform:  'translate(0px, 0px)  rotate(180deg)', backgroundColor: backgroundColor},
        {transform:  `translate(${end[0]}px, ${end[1]}px) rotate(360deg) translate(${end[0]}px, ${end[1]}px)`, backgroundColor: backgroundColor, opacity:0}
    ], {
        duration: animationSpeed,
        interations: 1,
        fill: "forwards"
    });

    return newParticle;
}

function spawnParticles(event) {
    let mouse_x = event.clientX;
    let mouse_y = event.clientY;

    // :: VARS TO CHANGE ::
    const particleDiameter = 15; // Width of particles in pixels
    const waveRadius = randIntBetween(25, 60); // Radius of circle around click origin that particles travel to the edge of
    const numParticles = randIntBetween(5, 9); // The number of particles to spawn on click
    let backgroundColor = `rgba(${randIntBetween(0, 255)}, ${randIntBetween(0, 255)}, ${randIntBetween(0, 255)}, 1)`; // Color of particles
    const angleBetweenParticles = 2*Math.PI / numParticles; // DO NOT CHANGE (evenly spaces particles around click origin)
    const animationSpeed = 500; // Length (speed) of animation (particle traveling to edge of wave)
    const trailSpacing = 0.05; // How far trails are apart from each other
    const trailLength = randIntBetween(1, 4); // Number of particles to use as trail for a given particle

    // Create each particle and its trail
    for (let i = 0; i < numParticles; i++) {
        let curr_angle = i*angleBetweenParticles;
        let start_x = mouse_x - particleDiameter/2;
        let start_y = mouse_y - particleDiameter/2;
        let end_x = Math.cos(curr_angle)*waveRadius;
        let end_y = Math.sin(curr_angle)*waveRadius;

        let particleList = []; // List of particles made (including trails) to delete later
        let particle = createNewParticle(particleDiameter, backgroundColor, animationSpeed, [start_x, start_y], [end_x, end_y]);
        particleList.push(particle);
        document.getElementsByTagName("html")[0].appendChild(particle);

        // Make trail particles (delayed animation speed to lag behind main particle)
        for (let j = 1; j < trailLength+1; j++) {
            let newTrail = createNewParticle(particleDiameter, backgroundColor, animationSpeed+(animationSpeed*trailSpacing*j), [start_x, start_y], [end_x, end_y]);
            particleList.push(newTrail);
            document.getElementsByTagName("html")[0].appendChild(newTrail);
        }

        // Delete all particles for this click (after last trail finishes)
        setTimeout(function() {
            for (let k = 0; k < particleList.length; k++) {
                let curr_particle = particleList[k];
                curr_particle.parentNode.removeChild(curr_particle);
            }
        }, animationSpeed+(animationSpeed*trailSpacing*trailLength));
    }
} // END spawnParticles

document.addEventListener("click", spawnParticles);