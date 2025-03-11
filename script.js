function updateCountdown() {
    fetch("http://localhost:3000/time-remaining") // Replace with your actual deployed server URL later
        .then(response => response.json())
        .then(data => {
            let timeLeft = data.remainingSeconds;
            const countdownElement = document.getElementById("countdown");

            function updateDisplay() {
                if (timeLeft <= 0) {
                    countdownElement.textContent = "Game resets!";
                } else {
                    let hours = Math.floor(timeLeft / 3600);
                    let minutes = Math.floor((timeLeft % 3600) / 60);
                    let seconds = timeLeft % 60;
                    countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
                    timeLeft--;
                    setTimeout(updateDisplay, 1000);
                }
            }

            updateDisplay();
        })
        .catch(error => console.error("Error fetching time:", error));
}

updateCountdown();
