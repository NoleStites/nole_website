const mongoose = require("mongoose");

const employee = new mongoose.Schema({ // IDs are created automatically by mongoose
    fname: { // First name
        type: String,
        required: true
    },
    lname: { // Last name
        type: String,
        required: true
    },
    department: { // categories: Marketing, Customer Service, Human Resources, IT, Sales
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Employee', employee);