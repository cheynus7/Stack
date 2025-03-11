const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// Countdown logic
let resetTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

app.get("/time-remaining", (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = resetTime - currentTime;
    res.json({ remainingSeconds: remainingSeconds > 0 ? remainingSeconds : 0 });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
