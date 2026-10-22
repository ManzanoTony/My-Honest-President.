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
let timeLeft = 60;
let gameIntervalId = null;
let enemySpawnIntervalId = null;
let timerIntervalId = null;
let canShoot = true;
let selectedPresidentKey = null; // Stores "trump" or "putin"

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

  timeLeft = 60;
  timerDisplayNode.innerText = "Time: 01:00";

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

  timeLeft = 60;
  timerDisplayNode.innerText = "Time: 01:00";

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
  if (bulletsArr[0] && bulletsArr[0].x > 560) {
    bulletsArr[0].node.remove();
    bulletsArr.shift();
  }
}

function checkBulletEnemyCollision() {
  bulletsArr.forEach((bullet, bIndex) => {
    enemiesArr.forEach((enemy, eIndex) => {
      let isColliding =
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y;

      if (isColliding) {
        bullet.node.remove();
        bulletsArr.splice(bIndex, 1);

        enemy.node.remove();
        enemiesArr.splice(eIndex, 1);
      }
    });
  });
}

// FIXED: Spawns the correct president using the config object
function addPlayer() {
  if (!selectedPresidentKey) return;
  const chosenConfig = PRESIDENTS[selectedPresidentKey];
  playerObj = new Player(chosenConfig);
}

function addEnemy() {
  let randomSpeed = Math.floor(Math.random() * 15) + 5;
  let newEnemy = new Enemies(randomSpeed);
  enemiesArr.push(newEnemy);
}

function checkEnemyDespawn() {
  if (enemiesArr[0] && enemiesArr[0].x + enemiesArr[0].width < 0) {
    enemiesArr[0].node.remove();
    enemiesArr.shift();
  }
}

function checkPaddedCollision(element1, element2, padding) {
  return (
    element1.x + padding < element2.x + element2.width - padding &&
    element1.x + element1.width - padding > element2.x + padding &&
    element1.y + padding < element2.y + element2.height - padding &&
    element1.y + element1.height - padding > element2.y + padding
  );
}

function checkCollisionPlayerEnemy() {
  if (!playerObj) return;

  enemiesArr.forEach((enemy, index) => {
    if (!playerObj.isImmune && checkPaddedCollision(enemy, playerObj, 55)) {
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

// FIXED: Character selection listener tracks Trump vs Putin explicitly
characterSelectionNode.addEventListener("click", (event) => {
  const clickedBtn = event.target.closest("button");
  if (clickedBtn) {
    if (clickedBtn.id === "putin-btn") {
      selectedPresidentKey = "putin";
      gameStart();
    } else if (clickedBtn.id === "trump-btn") {
      selectedPresidentKey = "trump";
      gameStart();
    }
  }
});

tryAgainBtn1Node.addEventListener("click", restartGame);
tryAgainBtn2Node.addEventListener("click", restartGame);

// MONEY SHOOTING (Right Arrow Key)

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    if (playerObj && canShoot) {
      playerObj.shoot();
      canShoot = false;

      setTimeout(() => {
        canShoot = true;
      }, 2000);
    }
  }
});

// JUMP CONTROLS (Space bar)

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    if (playerObj && !playerObj.isJumping) {
      playerObj.isJumping = true;
      playerObj.setJumpingImage(); // Dynamically uses active president's jump GIF

      let jumpUp = setInterval(() => {
        playerObj.moveUp();
      }, 18);

      setTimeout(() => {
        clearInterval(jumpUp);
        
        setTimeout(() => {
          let jumpDown = setInterval(() => {
            playerObj.moveDown();
          }, 18);

          setTimeout(() => {
            clearInterval(jumpDown);
            
            playerObj.y = 340;
            playerObj.node.style.top = `${playerObj.y}px`;
            playerObj.isJumping = false;
            playerObj.setRunningImage(); // Dynamically returns to running GIF

          }, 450);
        }, 100);
      }, 450);
    }
  }
});
