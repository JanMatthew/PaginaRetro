document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-now-button");
    const gameOverlay = document.getElementById("game-overlay");
    const countdown = document.getElementById("countdown");
    const game = document.getElementById("game");
    const livesImg = document.getElementById("lives")

    let lives = 3;
    let gameInterval;

    // Start the game
    playButton.addEventListener("click", () => {
        playButton.style.display = "none";
        gameOverlay.style.display = "flex";
        startCountdown();
    });

    // Countdown before game starts
    function startCountdown() {
        let counter = 3;
        countdown.textContent = counter;

        const countdownInterval = setInterval(() => {
            counter--;
            countdown.textContent = counter;

            if (counter <= 0) {
                clearInterval(countdownInterval);
                gameOverlay.style.display = "none";
                startGame();
            }
        }, 1000);
    }

    // Start the game logic
    function startGame() {
        game.style.display = "block";
        lives = 3;
        gameInterval = setInterval(spawnEnemy, 1000); // Spawn enemies every second
    }

    // Spawn enemies
    function spawnEnemy() {
        const enemyContainer = document.createElement("div");
        enemyContainer.classList.add("enemy-container");

        const lifebar = document.createElement("img");
        lifebar.src = "img/life/lifebar3.png";
        lifebar.classList.add("lifebar");

        const enemy = document.createElement("div");
        enemy.setAttribute("life",3);
        enemy.classList.add("enemy");

        enemyContainer.appendChild(lifebar);
        enemyContainer.appendChild(enemy);

        // Random horizontal position
        enemyContainer.style.left = Math.random() * (window.innerWidth - 50) + "px";
        enemyContainer.style.top = "0px";

        // Add enemy to the game
        game.appendChild(enemyContainer);

        // Animate enemy downward
        const fallInterval = setInterval(() => {
            const currentTop = parseInt(window.getComputedStyle(enemyContainer).top);
            if (currentTop >= window.innerHeight - 50) {
                clearInterval(fallInterval);
                game.removeChild(enemyContainer);
                loseLife();
            } else {
                enemyContainer.style.top = currentTop + 5 + "px";
            }
        }, 30);

        enemy.addEventListener("click", () => {
            if(enemy.getAttribute("life")>1){
                enemy.setAttribute("life",enemy.getAttribute("life")-1)
                lifebar.src = `img/life/lifebar${enemy.getAttribute("life")}.png`
            }
            else{
                lifebar.src = `img/life/lifebar${enemy.getAttribute("life")}.png`
                clearInterval(fallInterval);  // Detener el movimiento
                enemyContainer.removeChild(lifebar);
                // Eliminar la animación actual
                enemy.style.animation = "none";
            
                // Añadir la animación de muerte
                enemy.style.animation = "bichoDeath 1s steps(1) forwards";
            
            }
        });
    }
    // Lose a life
    function loseLife() {
        lives--;
        livesImg.src = `img/life/lifebar${lives}.png`;
        if (lives <= 0) {
            endGame();
        }
    }

    // End the game
    function endGame() {
        clearInterval(gameInterval);
        alert("Game Over!");
        game.style.display = "none";
        playButton.style.display = "block";
    }
});