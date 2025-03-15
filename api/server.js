const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '../../')));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});