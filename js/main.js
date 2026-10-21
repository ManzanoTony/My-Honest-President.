// GLOBAL DOM ELEMENTS

const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#main-game-screen");
const characterSelectionNode = document.querySelector(".character-selection");
const winScreenNode = document.querySelector("#winning-screen");
const looseScreenNode = document.querySelector("#loosing-screen");
const gameBoxNode = document.querySelector("#game-box");
const timerDisplayNode = document.querySelector("#timer-display");
const tryAgainBtn1Node = document.querySelector("#try-again1");
const tryAgainBtn2Node = document.querySelector("#try-again2");


// GLOBAL GAME VARIABLES

let playerObj = null;
let enemiesArr = [];
let bulletsArr = [];
let timeLeft = 120;
let gameIntervalId = null;
let enemySpawnIntervalId = null;
let timerIntervalId = null;

// GLOBAL GAME FUNCTIONS

// TIMER

function triggerWin() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  gameScreenNode.style.display = "none";
  winScreenNode.style.display = "block";
}

function updateTimer() {
  timeLeft--;

  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  timerDisplayNode.innerText = `Time: 0${minutes}:${seconds}`;

  if (timeLeft <= 0) {
    triggerWin();
  }
}

function gameStart() {
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);
  clearInterval(timerIntervalId);

  // Clear old objects if any exist
  if (playerObj) {
    playerObj.node.remove();
    playerObj = null;
  }

  enemiesArr.forEach((enemy) => enemy.node.remove());
  enemiesArr = [];

  bulletsArr.forEach((bullet) => bullet.node.remove());
  bulletsArr = [];

  // Reset timer value on start
  timeLeft = 120;
  timerDisplayNode.innerText = "Time: 02:00";

  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  addPlayer();
  addEnemy();

  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60));
  enemySpawnIntervalId = setInterval(addEnemy, 2000);
  timerIntervalId = setInterval(updateTimer, 1000);
}


// MAIN GAME INTERVAL

setInterval(gameLoop, Math.round(1000 / 60));

// STARTING OTHER INTERVALS


function gameLoop() {
  enemiesArr.forEach((enemy) => {
    enemy.automaticMovement();
  });

  // MOVE BULLETS FORWARD
  bulletsArr.forEach((bullet) => {
    bullet.moveForward();
  });

  checkBulletDespawn();
  checkBulletEnemyCollision();
  checkEnemyDespawn();
  checkCollisionPlayerEnemy();
}

function checkBulletDespawn() {
  if (bulletsArr[0] && bulletsArr[0].x > 800) {
    bulletsArr[0].node.remove();
    bulletsArr.shift();
  }
}

function checkBulletEnemyCollision() {
  bulletsArr.forEach((bullet, bIndex) => {
    enemiesArr.forEach((enemy, eIndex) => {
      if (checkCollision(bullet, enemy)) {
        // Remove bullet
        bullet.node.remove();
        bulletsArr.splice(bIndex, 1);

        // One-hit knockout on enemy!
        enemy.node.remove();
        enemiesArr.splice(eIndex, 1);
      }
    });
  });
}

// CHARACTER FUNTIONS

function addPlayer() {
  playerObj = new Player();
}

function addEnemy() {
  let randomSpeed = Math.floor(Math.random() * 10) + 3;
  let newEnemy = new Enemies(randomSpeed);
  enemiesArr.push(newEnemy);
  console.log(enemiesArr.length);
}

function checkEnemyDespawn() {
  if (enemiesArr[0] && enemiesArr[0].x < -20) {
    enemiesArr[0].node.remove();
    enemiesArr.shift();
  }
}

function checkCollision(element1, element2) {
  return (
    element1.x < element2.x + element2.width &&
    element1.x + element1.width > element2.x &&
    element1.y < element2.y + element2.height &&
    element1.y + element1.height > element2.y
  );
}

function checkCollisionPlayerEnemy() {
  enemiesArr.forEach((enemy) => {
    if (checkCollision(enemy, playerObj)) {
      console.log(" You lost money");
    }
  });
}

// EVENT LISTENERS

characterSelectionNode.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    gameStart();
  }
});

// TRY AGAIN BUTTONS
tryAgainBtn1Node.addEventListener("click", () => {
  winScreenNode.style.display = "none";
  startScreenNode.style.display = "block";
});

tryAgainBtn2Node.addEventListener("click", () => {
  looseScreenNode.style.display = "none";
  startScreenNode.style.display = "block";
});

// SHOOTING CONTROLS (Right Arrow)
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    if (playerObj) {
      playerObj.shoot();
    }
  }
});

// JUMP CONTROLS (Spacebar)
window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    let jumpUp = setInterval(() => {
      playerObj.moveUp();
    }, 20);

    setTimeout(() => {
      clearInterval(jumpUp);
      let jumpDown = setInterval(() => {
        playerObj.moveDown();
      }, 20);
      setTimeout(() => {
        clearInterval(jumpDown);
      }, 300);
    }, 300);
  }
});

