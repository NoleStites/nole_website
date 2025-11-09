require('dotenv').config() // Imports all of our environment variables in the '.env' file

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.redirect('/Landing_Page');
});

app.get('/Landing_Page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Landing_Page/index.html')); // Serve the "home" page
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API to get file names from a directory (for Minecraft_Blocks page)
app.get('/api/files/:subdir', (req, res) => {
  const subdirectory = req.params.subdir;
  const directoryPath = path.join(__dirname, 'public/Minecraft_Blocks/textures', subdirectory);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: `Unable to read directory ${subdirectory}`, details: err.message });
    }
    res.json(files); // Send the list of files in the subdirectory
  });
});

app.use(express.json());
const employeeRoute = require("./routes/employeeRoute");
app.use('/employeeRoute', employeeRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});