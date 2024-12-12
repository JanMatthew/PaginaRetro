document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-now-button");
    const gameOverlay = document.getElementById("game-overlay");
    const countdown = document.getElementById("countdown");
    const game = document.getElementById("game");
    const livesImg = document.getElementById("lives");
    const gameOver = document.getElementById("game-over");
    const restart = document.getElementById("restart");
    const pointsScore = document.getElementById("points");
    const score = document.getElementById("score");

    let lives = 3;
    let gameInterval;
    let points = 0;
    let combo = 0;
    let multiplicador = 1;

    // Start the game
    playButton.addEventListener("click", () => {
        playButton.style.display = "none";
        gameOverlay.style.display = "flex";
        startCountdown();
    });
    //Restart the game
    restart.addEventListener("click", () => {
        gameOver.style.display = "none";
        gameOverlay.style.display = "flex"
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
        points = 0;
        score.textContent = `Puntos: ${points}`
        game.style.display = "block";
        lives = 3;
        livesImg.src = `img/life/lifebar${lives}.png`;

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
                showPoints(enemyContainer,(50 * multiplicador));
                score.textContent = `Puntos: ${points}`
                points+=(50 * multiplicador);
                playHitSound("shoot");
                combo +=1; 
                if(combo >= 10){
                    multiplicador+=1;
                    combo = 0;
                    showMultiply(enemyContainer,multiplicador);
                }
            }
            else if(enemy.getAttribute("life")==0){
                //Avoids give points for clicking the corpse
            }
            else{
                playHitSound("death");
                enemy.setAttribute("life",enemy.getAttribute("life")-1)
                points+=100 * multiplicador;
                score.textContent = `Puntos: ${points}`
                lifebar.src = `img/life/lifebar${enemy.getAttribute("life")}.png`
                clearInterval(fallInterval);  // Detener el movimiento
                enemyContainer.removeChild(lifebar);
                
                // Mostrar puntos ganados
                showPoints(enemyContainer, (100 * multiplicador));

                // Eliminar la animación actual
                enemy.style.animation = "none";
                
                // Añadir la animación de muerte
                enemy.style.animation = "bichoDeath 1s steps(1) forwards";
                combo+=2;
                if(combo >= 10){
                    multiplicador+=1;
                    showMultiply(enemyContainer,multiplicador);
                    combo = 0;
                }
            }
        });
    }
    function playHitSound(sound) {
        const hitSound = new Audio(`audio/${sound}.mp3`);
        hitSound.play();
    }
    


    // Mostrar puntos ganados
    function showPoints(enemyContainer, points) {
        const pointsElement = document.createElement("div");
        pointsElement.classList.add("points-display");
        pointsElement.textContent = `+${points}`;
        pointsElement.style.left = "50%";
        pointsElement.style.transform = "translateX(-50%)";
        enemyContainer.appendChild(pointsElement);

        // Animar y eliminar después
        setTimeout(() => {
            pointsElement.remove();
        }, 1000);
    }
    // Mostrar puntos ganados
    function showMultiply(enemyContainer, multiply) {
        const multElement = document.createElement("div");
        multElement.classList.add("mult-display");
        multElement.textContent = `x${multiplicador}`
        multElement.style.left = "-50%";
        multElement.style.transform = "translateX(-50%)";
        enemyContainer.appendChild(multElement);

        // Animar y eliminar después
        setTimeout(() => {
            multElement.remove();
        }, 1000);
    }

    // Lose a life
    function loseLife() {
        lives--;
        livesImg.src = `img/life/lifebar${lives}.png`;
        playHitSound("hit");
        combo = 0;
        multiplicador = 1;
        if (lives <= 0) {
            endGame();
        }
    }

    // End the game
    function endGame() {
        playHitSound("gameOver");
        clearInterval(gameInterval);

        const allEnemies = document.querySelectorAll(".enemy-container");
        allEnemies.forEach(enemy => enemy.remove());

        pointsScore.textContent = `Puntos: ${points}`

        game.style.display = "none";
        gameOver.style.display = "flex";
    }
});