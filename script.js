document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const countdownElement = document.getElementById("countdown");
    const leaderboardElement = document.getElementById("leaderboard");

    let blocks = [];
    let currentBlock = null;
    let speed = 4;
    let gameOver = false;
    let score = 0;
    let blockColors = ["purple", "gold"];
    let cameraOffset = 0;

    function fetchTimeRemaining() {
        fetch('/api/time-remaining')
            .then(response => response.json())
            .then(data => {
                let timeRemaining = data.timeRemaining;
                let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;
            })
            .catch(error => console.error('Error fetching time:', error));
    }

    function fetchLeaderboard() {
        fetch('/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardElement.innerHTML = data.map((entry, index) => 
                    `<li>${index + 1}. ${entry.name}: ${entry.score}</li>`
                ).join('');
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }

    function submitScore(name, score) {
        fetch('/api/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchLeaderboard();
            }
        })
        .catch(error => console.error('Error submitting score:', error));
    }

    function createBlock() {
        const width = blocks.length > 0 ? blocks[blocks.length - 1].width : 80;
        return {
            x: (canvas.width - width) / 2,
            y: blocks.length > 0 ? blocks[blocks.length - 1].y - 30 : canvas.height - 30,
            width: width,
            height: 30,
            direction: 1,
            color: blockColors[blocks.length % 2]
        };
    }

    function resetGame() {
        blocks = [{ x: (canvas.width - 80) / 2, y: canvas.height - 30, width: 80, height: 30, color: "purple" }];
        currentBlock = createBlock();
        score = 0;
        gameOver = false;
        cameraOffset = 0;
    }

    function update() {
        if (gameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentBlock.x += speed * currentBlock.direction;
        if (currentBlock.x + currentBlock.width > canvas.width || currentBlock.x < 0) {
            currentBlock.direction *= -1;
        }

        if (currentBlock.y < canvas.height * (1 / 4)) {
            cameraOffset = canvas.height * (1 / 4) - currentBlock.y;
        }

        ctx.save();
        ctx.translate(0, cameraOffset);

        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 10, 20 - cameraOffset);

        blocks.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        ctx.fillStyle = currentBlock.color;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);

        ctx.restore();

        requestAnimationFrame(update);
    }

    canvas.addEventListener("click", function () {
        if (gameOver) return;

        const lastBlock = blocks[blocks.length - 1];
        const overlap = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width) - Math.max(currentBlock.x, lastBlock.x);

        if (overlap > 0) {
            if (overlap < currentBlock.width) {
                currentBlock.width = overlap;
                currentBlock.x = Math.max(currentBlock.x, lastBlock.x);
            }
            blocks.push(currentBlock);
            currentBlock = createBlock();
            score++;
        } else {
            gameOver = true;
            const name = prompt("Game Over! Enter your name:");
            if (name) {
                submitScore(name, score);
            }
            alert(`Game Over! Your score: ${score}`);
        }
    });

    function startCountdown() {
        setInterval(fetchTimeRemaining, 1000);
    }

    resetGame();
    update();
    startCountdown();
    fetchLeaderboard();
});