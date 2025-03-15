const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
let startTime = Date.now();
let leaderboard = [];

app.get('/time-remaining', (req, res) => {
    let timeRemaining = INTERVAL - (Date.now() - startTime) % INTERVAL;
    res.json({ timeRemaining });
});

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard.slice(0, 3)); // Return top 3 scores
});

app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score in descending order
    res.json({ success: true });
});

function resetGame() {
    console.log('Game reset!');
    startTime = Date.now();
    leaderboard = []; // Reset leaderboard
}

// Automatically reset the game every 6 hours
setInterval(resetGame, INTERVAL);

module.exports = app;