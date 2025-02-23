
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
        result_el.dataset.employeeID = result_dict._id;

        let top_section = document.createElement("div");
        top_section.classList.add("res_top_section");
        let name_section = document.createElement("div");
        name_section.classList.add("res_name_section");
        name_section.innerHTML = result_dict.lname + ", " + result_dict.fname;

        let update_res = document.createElement("img");
        update_res.classList.add("update_btn");
        update_res.src = "./update.svg";
        update_res.addEventListener("click", function() {
            return; // TODO
        });

        let delete_res = document.createElement("img");
        delete_res.classList.add("delete_btn");
        delete_res.src = "./delete.svg";
        delete_res.addEventListener("click", function() {
            result_el.remove();
            deleteEmployee(result_el.dataset.employeeID);
        });

        top_section.appendChild(name_section);
        top_section.appendChild(update_res);
        top_section.appendChild(delete_res);
        result_el.appendChild(top_section);
        
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
document.getElementById("cancel_create_btn").addEventListener("click", function() {
    document.getElementById("popup_create_panel").style.display = "none";
});
document.getElementById("create_employee_btn").addEventListener("click", function() {
    document.getElementById("popup_create_panel").style.display = "block";
});

// Create one
document.getElementById("create_form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const fname = document.getElementById("c_fname").value;
    const lname = document.getElementById("c_lname").value;
    const department = document.querySelector('input[name="c_department"]:checked').value;
    const salary = document.getElementById("c_salary").value;

    // Construct query parameters dynamically
    const queryParams = new URLSearchParams();

    if (fname) queryParams.append("fname", fname);
    if (lname) queryParams.append("lname", lname);
    if (department) queryParams.append("department", department);
    if (salary) queryParams.append("salary", salary);

    // const response = await fetch(`/employeeRoute?${queryParams.toString()}`, {
    const response = await fetch(`/employeeRoute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fname": fname,
            "lname": lname,
            "department": department,
            "salary": salary
        })
    });

    if (response.ok) {
        alert("Employee created successfully.");
    } else {
        const error = await response.json();
        alert("Error: " + error.message);
    }
});

// Delete One
async function deleteEmployee(id) {
    const response = await fetch(`/employeeRoute/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        alert("Employee deleted successfully.");
    } else {
        const error = await response.json();
        alert("Error: " + error.message);
    }
}