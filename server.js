// Import express and create an app
const express = require('express');
const path = require('path');
const app = express();

// Set the port
const port = 3000;

// Serve static files (like HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname, '/')));

// Serve the index.html when accessing the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});