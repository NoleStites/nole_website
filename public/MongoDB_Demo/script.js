
function makeDataAttributeElement(displayName, value) {
    let dataAttr = document.createElement("div");
    dataAttr.classList.add("dataAttr");
    let dataAttr_span = document.createElement("span");
    dataAttr_span.classList.add("dataAttr_span");
    dataAttr_span.innerHTML = displayName + ": ";
    let dataAttr_value = document.createElement("p");
    dataAttr_value.classList.add("dataAttr_value");
    dataAttr_value.innerHTML = value;

    dataAttr.appendChild(dataAttr_span);
    dataAttr.appendChild(dataAttr_value);
    return dataAttr;
}

function emptyResults() {
    let results_section = document.getElementById("results_section");
    let results = results_section.children;
    console.log(results_section.children);
    for (let i = results.length-1; i > -1; i--) {
        results_section.removeChild(results[i]);
    }
}

function updateResultsSection(results_list) {
    emptyResults();

    let results_section = document.getElementById("results_section");
    for (let i = 0; i < results_list.length; i++) {
        let result_dict = results_list[i];
        
        let result_el = document.createElement("div");
        result_el.classList.add("result");

        let name_section = document.createElement("div");
        name_section.classList.add("res_name_section");
        name_section.innerHTML = result_dict.lname + ", " + result_dict.fname;
        result_el.appendChild(name_section);
        
        let data_section = document.createElement("div");
        data_section.classList.add("res_data_section");

        // Call helper funtion to make HTML elements
        let department = makeDataAttributeElement("Department", result_dict.department);
        data_section.appendChild(department);
        let salary = makeDataAttributeElement("Salary", result_dict.salary);
        data_section.appendChild(salary);

        result_el.appendChild(data_section);
        results_section.appendChild(result_el);
    }
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
        updateResultsSection(data);
        // document.getElementById("output_box").innerHTML = data.favoriteFruit;
    } else {
        // const error = await response.json();
        emptyResults();
        let no_results = document.createElement("div");
        no_results.id = "no_results";
        no_results.innerHTML = "No results found.";
        document.getElementById("results_section").appendChild(no_results);
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