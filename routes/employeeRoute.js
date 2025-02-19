const express = require("express");
const router = express.Router();
const Employee = require("../models/employee"); // Fetch the database model from the models folder

// We use 'async' below whenever we need to access the database

// Flexible Query Route
router.get('/', async (req, res) => {
    try {
        const query = {}; // Dynamic query object

        // Add filters based on request query parameters
        if (req.query.fname) query.fname = req.query.fname;
        if (req.query.lname) query.lname = req.query.lname;
        if (req.query.department) query.department = req.query.department;
        if (req.query.salary) query.salary = req.query.salary; // Assuming salary is an exact match

        // Fetch employees based on constructed query
        const employees = await Employee.find(query);

        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found matching criteria' });
        }
        
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/*
// Get all
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message }); // 500 error says that it is a problem with our server, not the user
    }
});

// Get one by ID
router.get('/:id', getEmployee, (req, res) => { // getEmployee is calling our Middleware to populate the res.employee attribute
    // res.send(req.params.id); // This was run before we added Middleware
    res.send(res.employee);
});
*/
// Create one
router.post('/', async (req, res) => {
    const employee = new Employee({
        fname: req.body.fname,
        lname: req.body.lname,
        department: req.body.department,
        salary: req.body.salary
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee); // Status 201 means "successfully created an object"
    } catch (err) {
        res.status(400).json({ message: err.message }); // Status 400 suggests a user input problem
    }
});

// Update one
router.patch('/:id', getEmployee, async (req, res) => {
    if (req.body.name != null) {
        res.employee.name = req.body.name;
    }
    if (req.body.favoriteFruit != null) {
        res.employee.favoriteFruit = req.body.favoriteFruit;
    }

    try {
        const updatedTester = await res.employee.save();
        res.json(updatedTester);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one
router.delete('/:id', getEmployee, async (req, res) => {
    try {
        await res.employee.deleteOne();
        res.json({ message: "Deleted employee" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating Middleware
// Use: because many routes above will first need to use a given ID to fetch an entry from the database,
// we use Middleware to avoid needed to duplicate the code into all routes (because they have the same functionality)
async function getEmployee(req, res, next) {
    let employee;
    try {
        employee = await Employee.findById(req.params.id);
        if (employee == null) { // Entry does not exist, so do not continue
            return res.status(404).json({ message: 'Cannot find employee' }); // Status 404 means that you could not find something
        } 
    } catch (err) {
        return res.status(500).json({ message: err.message }); // Status 500 means something is wrong with our server
    }

    res.employee = employee; // We are creating the 'employee' attribute of 'res' here. It did not exist until now.
    next() // Move on to the next piece of Middleware or the routes themselves

}

module.exports = router;