function createNote(don_ka) {
    let note_box = document.createElement("div");
    note_box.classList.add("note_box");

    let don_ka_image = document.createElement("div");
    don_ka_image.classList.add("don_ka_image");

    let circle_image = document.createElement("div");
    circle_image.classList.add("circle_image");

    let don_ka_text = document.createElement("h3");
    don_ka_text.classList.add("don_ka_text");
    don_ka_text.innerHTML = don_ka;

    don_ka_image.appendChild(circle_image);
    note_box.appendChild(don_ka_image);
    note_box.appendChild(don_ka_text);

    return note_box;
}

let note_section = document.getElementById("note_section");

