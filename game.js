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

    // Comienza el juego
    playButton.addEventListener("click", () => {
        playButton.style.display = "none";
        gameOverlay.style.display = "flex";
        startCountdown();
    });
    //Reinicia el juego
    restart.addEventListener("click", () => {
        gameOver.style.display = "none";
        gameOverlay.style.display = "flex"
        startCountdown();
    });
    // Cuenta atras antes de empezar el juego
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

    // Empezar la logica del juego
    function startGame() {
        points = 0;
        score.textContent = `Puntos: ${points}`
        game.style.display = "block";
        lives = 3;
        livesImg.src = `img/life/lifebar${lives}.png`;

        gameInterval = setInterval(spawnEnemy, 1000); // Spawn enemies every second
    }

    // Aparecer enemigos
    function spawnEnemy() {

        const enemyContainer = document.createElement("div");
        enemyContainer.classList.add("enemy-container");

        const enemy = document.createElement("div");
         
        //Numero aleatorio para decidir el tipo de enemigo
        let numeroAleatorio = Math.floor(Math.random() * 20);
        let velocity = 0;
        let deathAnimation = "";

        //Enemigo: bicho
        if(numeroAleatorio <10){
            enemy.classList.add("bicho");
            enemy.setAttribute("life",3);
            velocity = 5;
            deathAnimation = "bichoDeath"; 
        }
        //Enemigo: mosca
        else if(numeroAleatorio<17){
            enemy.classList.add("fly")
            enemy.setAttribute("life",1);
            velocity = 7;
            deathAnimation = "flyDeath"; 
        }
        //Enemigo: tanque
        else{
            enemy.classList.add("tank")
            enemy.setAttribute("life",6);
            velocity = 2.5;
            deathAnimation="tankDeath";
        }

        const lifebar = document.createElement("img");
        lifebar.src = `img/life/lifebar${enemy.getAttribute("life")}.png`;
        lifebar.classList.add("lifebar");

        enemyContainer.appendChild(lifebar);
        enemyContainer.appendChild(enemy);

        // Posicion horizontal aleatoria
        enemyContainer.style.left = Math.random() * (window.innerWidth - 50) + "px";
        enemyContainer.style.top = "0px";

        // Añadir enemigo al juego
        game.appendChild(enemyContainer);

        // Animar bajada del enemigo
        const fallInterval = setInterval(() => {
            const currentTop = parseInt(window.getComputedStyle(enemyContainer).top);
            //Si llega abajo desaparece y se resta una vida
            if (currentTop >= window.innerHeight - 50) {
                clearInterval(fallInterval);
                game.removeChild(enemyContainer);
                loseLife();
            }
            //No ha llegado aun, sigue bajando a su velocidad 
            else {
                enemyContainer.style.top = currentTop + velocity + "px";
            }
        }, 30);

        //Trigger de disparar al enemigo(Clicarle)
        enemy.addEventListener("click", () => {
            //Si aun le queda mas de una vida se le resta una y se muestran los puntos y multiplicador
            if(enemy.getAttribute("life")>1){
                enemy.setAttribute("life",enemy.getAttribute("life")-1)
                lifebar.src = `img/life/lifebar${enemy.getAttribute("life")}.png`
                showPoints(enemyContainer,(50 * multiplicador));
                score.textContent = `Puntos: ${points}`
                points+=(50 * multiplicador);
                playHitSound("shoot");
                combo +=1; 
                //Si el combo es mas de 10 se añade un punto al multiplicador y se reinicia el combo
                if(combo >= 10){
                    multiplicador+=1;
                    combo = 0;
                    showMultiply(enemyContainer,multiplicador);
                }
            }
            else if(enemy.getAttribute("life")==0){
                //Evitar dar puntos al clicar sobre un enemigo ya muerto
            }
            //Si le queda una vida se hace la animacion de muerte
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
                enemy.style.animation = `${deathAnimation} 1s steps(1) forwards`;
                combo+=2;
                if(combo >= 10){
                    multiplicador+=1;
                    showMultiply(enemyContainer,multiplicador);
                    combo = 0;
                }
            }
        });
    }

    //Lanzar el sonido
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

    // Quitar una vida, y reinciar el combo y multiplicador
    function loseLife() {
        lives--;
        livesImg.src = `img/life/lifebar${lives}.png`;
        playHitSound("hit");
        combo = 0;
        multiplicador = 1;
        //Ya no tiene mas vidas Pierde
        if (lives <= 0) {
            endGame();
        }
    }

    // Acabar el juego
    function endGame() {
        playHitSound("gameOver");
        clearInterval(gameInterval);
        //Se eliminan todos los enemigos
        const allEnemies = document.querySelectorAll(".enemy-container");
        allEnemies.forEach(enemy => enemy.remove());
        
        pointsScore.textContent = `Puntos: ${points}`

        game.style.display = "none";
        gameOver.style.display = "flex";
    }
});