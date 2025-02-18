// Get one
document.getElementById("getOneForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Please enter an ID");
        return;
    }
    // window.location.href = `/myRoute/${id}`; // Redirect to the correct route

    const response = await fetch(`/myRoute/${id}`, {
        method: "GET"
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("output_box").innerHTML = data.favoriteFruit;
    } else {
        const error = await response.json();
        alert("Error: " + error.message);
    }
});

// Create one
document.getElementById("createTesterForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
    const name = document.getElementById("name").value;
    const favoriteFruit = document.getElementById("favoriteFruit").value;

    // Preprocess the form data before adding to database
    // ...

    const response = await fetch("/myRoute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, favoriteFruit })
    });

    if (response.ok) {
        alert("Tester created successfully!");
    } else {
        const error = await response.json();
        alert("Error: " + error.message);
    }
});