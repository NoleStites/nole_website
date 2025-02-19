function updateResultsSection(results_list) {
    
}

// Get one
document.getElementById("searchForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const department = document.querySelector('input[name="department"]:checked').value;
    const salary = document.getElementById("salary").value;

    // Construct query parameters dynamically
    const queryParams = new URLSearchParams();

    if (fname) queryParams.append("fname", fname);
    if (lname) queryParams.append("lname", lname);
    if (department != "no_filter") queryParams.append("department", department);
    if (salary) queryParams.append("salary", salary);

    const response = await fetch(`/employeeRoute?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        // document.getElementById("output_box").innerHTML = data.favoriteFruit;
    } else {
        const error = await response.json();
        alert("Error: " + error.message);
    }
});

// Create one
// document.getElementById("createTesterForm").addEventListener("submit", async function (event) {
//     event.preventDefault(); // Prevent default form submission
//     const name = document.getElementById("name").value;
//     const favoriteFruit = document.getElementById("favoriteFruit").value;

//     // Preprocess the form data before adding to database
//     // ...

//     const response = await fetch("/myRoute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, favoriteFruit })
//     });

//     if (response.ok) {
//         alert("Tester created successfully!");
//     } else {
//         const error = await response.json();
//         alert("Error: " + error.message);
//     }
// });