const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
let startTime = Date.now();

app.get('/time-remaining', (req, res) => {
    let timeRemaining = INTERVAL - (Date.now() - startTime) % INTERVAL;
    res.json({ timeRemaining });
});

function resetGame() {
    console.log('Game reset!');
    startTime = Date.now();
}

// Automatically reset the game every 6 hours
setInterval(resetGame, INTERVAL);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});