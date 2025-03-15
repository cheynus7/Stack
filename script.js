document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let blocks = [];
    let currentBlock = null;
    let speed = 4;
    let gameOver = false;
    let score = 0;
    let blockColors = ["purple", "gold"];
    let cameraOffset = 0;

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
            alert(`Game Over! Your score: ${score}`);
        }
    });

    resetGame();
    update();
});