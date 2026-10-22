// GLOBAL DOM ELEMENTS

const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#main-game-screen");
const characterSelectionNode = document.querySelector(".character-selection");
const winScreenNode = document.querySelector("#winning-screen");
const looseScreenNode = document.querySelector("#loosing-screen");
const gameBoxNode = document.querySelector("#game-box");
const timerDisplayNode = document.querySelector("#timer-display");
const livesDisplayNode = document.querySelector("#lives-display");
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

function triggerWin() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  gameScreenNode.style.display = "none";
  winScreenNode.style.display = "block";
}

function triggerLoss() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  gameScreenNode.style.display = "none";
  looseScreenNode.style.display = "block";
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

function updateLivesDisplay() {
  if (!playerObj) return;
  let moneyIcons = "💵 ".repeat(playerObj.lives);
  livesDisplayNode.innerText = `Lives: ${moneyIcons}`;
}

function gameStart() {
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);
  clearInterval(timerIntervalId);

  if (playerObj) {
    playerObj.node.remove();
    playerObj = null;
  }

  enemiesArr.forEach((enemy) => enemy.node.remove());
  enemiesArr = [];

  bulletsArr.forEach((bullet) => bullet.node.remove());
  bulletsArr = [];

  timeLeft = 120;
  timerDisplayNode.innerText = "Time: 02:00";

  startScreenNode.style.display = "none";
  winScreenNode.style.display = "none";
  looseScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  addPlayer();
  updateLivesDisplay();
  addEnemy();

  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60));
  enemySpawnIntervalId = setInterval(addEnemy, 2000);
  timerIntervalId = setInterval(updateTimer, 1000);
}

function restartGame() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  if (playerObj) {
    playerObj.node.remove();
    playerObj = null;
  }

  enemiesArr.forEach((enemy) => enemy.node.remove());
  enemiesArr = [];

  bulletsArr.forEach((bullet) => bullet.node.remove());
  bulletsArr = [];

  timeLeft = 120;
  timerDisplayNode.innerText = "Time: 02:00";

  winScreenNode.style.display = "none";
  looseScreenNode.style.display = "none";
  startScreenNode.style.display = "block";
}

function gameLoop() {
  enemiesArr.forEach((enemy) => {
    enemy.automaticMovement();
  });

  bulletsArr.forEach((bullet) => {
    bullet.moveForward();
  });

  checkBulletDespawn();
  checkBulletEnemyCollision();
  checkEnemyDespawn();
  checkCollisionPlayerEnemy();
}

function checkBulletDespawn() {
  if (bulletsArr[0] && bulletsArr[0].x > 1120) {
    bulletsArr[0].node.remove();
    bulletsArr.shift();
  }
}

function checkBulletEnemyCollision() {
  bulletsArr.forEach((bullet, bIndex) => {
    enemiesArr.forEach((enemy, eIndex) => {
      if (checkCollision(bullet, enemy)) {
        bullet.node.remove();
        bulletsArr.splice(bIndex, 1);

        enemy.node.remove();
        enemiesArr.splice(eIndex, 1);
      }
    });
  });
}

function addPlayer() {
  playerObj = new Player();
}

function addEnemy() {
  let randomSpeed = Math.floor(Math.random() * 15) + 5;
  let newEnemy = new Enemies(randomSpeed);
  enemiesArr.push(newEnemy);
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
  if (!playerObj) return;

  enemiesArr.forEach((enemy, index) => {
    if (!playerObj.isImmune && checkCollision(enemy, playerObj)) {
      playerObj.lives--;
      updateLivesDisplay();

      enemy.node.remove();
      enemiesArr.splice(index, 1);

      playerObj.isImmune = true;
      playerObj.node.style.opacity = "0.5";

      setTimeout(() => {
        if (playerObj) {
          playerObj.isImmune = false;
          playerObj.node.style.opacity = "1";
        }
      }, 1000);

      if (playerObj.lives <= 0) {
        triggerLoss();
      }
    }
  });
}

// EVENT LISTENERS

characterSelectionNode.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    gameStart();
  }
});

tryAgainBtn1Node.addEventListener("click", restartGame);
tryAgainBtn2Node.addEventListener("click", restartGame);

// MONEY SHOTTING (Right Arrow Key)

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    if (playerObj) {
      playerObj.shoot();
    }
  }
});

// JUMP CONTROLS (Space bar)

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    if (playerObj && !playerObj.isJumping) {
      playerObj.isJumping = true;

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
          playerObj.y = 545;
          playerObj.node.style.top = `${playerObj.y}px`;
          playerObj.isJumping = false;
        }, 300);
      }, 300);
    }
  }
});
