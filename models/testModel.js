const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({ // IDs are created automatically by mongoose
    name: {
        type: String,
        required: true
    },
    favoriteFruit: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Tester', testSchema);