const express = require("express");
const router = express.Router();
const Tester = require("../models/testModel"); // Fetch the database model from the models folder

// We use 'async' below whenever we need to access the database

// Get all
router.get('/', async (req, res) => {
    try {
        const testers = await Tester.find();
        res.json(testers);
    } catch (err) {
        res.status(500).json({ message: err.message }); // 500 error says that it is a problem with our server, not the user
    }
});

// Get one
router.get('/:id', getTester, (req, res) => { // getTester is calling our Middleware to populate the res.tester attribute
    // res.send(req.params.id); // This was run before we added Middleware
    res.send(res.tester);
});

// Create one
router.post('/', async (req, res) => {
    const tester = new Tester({
        name: req.body.name,
        favoriteFruit: req.body.favoriteFruit
    });

    try {
        const newTester = await tester.save();
        res.status(201).json(newTester); // Status 201 means "successfully created an object"
    } catch (err) {
        res.status(400).json({ message: err.message }); // Status 400 suggests a user input problem
    }
});

// Update one
router.patch('/:id', getTester, async (req, res) => {
    if (req.body.name != null) {
        res.tester.name = req.body.name;
    }
    if (req.body.favoriteFruit != null) {
        res.tester.favoriteFruit = req.body.favoriteFruit;
    }

    try {
        const updatedTester = await res.tester.save();
        res.json(updatedTester);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one
router.delete('/:id', getTester, async (req, res) => {
    try {
        await res.tester.deleteOne();
        res.json({ message: "Deleted tester" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating Middleware
// Use: because many routes above will first need to use a given ID to fetch an entry from the database,
// we use Middleware to avoid needed to duplicate the code into all routes (because they have the same functionality)
async function getTester(req, res, next) {
    let tester;
    try {
        tester = await Tester.findById(req.params.id);
        if (tester == null) { // Entry does not exist, so do not continue
            return res.status(404).json({ message: 'Cannot find tester' }); // Status 404 means that you could not find something
        } 
    } catch (err) {
        return res.status(500).json({ message: err.message }); // Status 500 means something is wrong with our server
    }

    res.tester = tester; // We are creating the 'tester' attribute of 'res' here. It did not exist until now.
    next() // Move on to the next piece of Middleware or the routes themselves

}

module.exports = router;