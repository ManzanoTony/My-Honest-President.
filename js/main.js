// GLOBAL DOM ELEMENTS

const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#main-game-screen");
const characterSelectionNode = document.querySelector(".character-selection");
const winScreenNode = document.querySelector("#winning-screen");
const looseScreenNode = document.querySelector("#loosing-screen");
const gameBoxNode = document.querySelector("#game-box");

// GLOBAL GAME VARIABLES

let playerObj = null;
let enemiesArr = [];

// GLOBAL GAME FUNCTIONS

function gameStart() {
  // This part chnages the screens so we can start playing

  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // GAME INITIAL ELEMENTS

  addPlayer();
  addEnemy();

  // MAIN GAME INTERVAL

  setInterval(gameLoop, Math.round(1000 / 60));

  // STARTING OTHER INTERVALS
  setInterval(addEnemy, 2000);
}

function gameLoop() {
  enemiesArr.forEach((enemy) => {
    enemy.automaticMovement();
  });
  checkEnemyDespawn();
  checkCollisionPlayerEnemy();
}

// CHARACTER FUNTIONS

function addPlayer() {
  playerObj = new Player();
}

function addEnemy() {
  let randomSpeed = Math.floor(Math.random() * 5) + 3;
  let newEnemy = new Enemies(randomSpeed);
  enemiesArr.push(newEnemy);
  console.log(enemiesArr.length);
}

function checkEnemyDespawn() {
  if (enemiesArr[0] && enemiesArr[0].x < -100) {
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

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    let jumpUp = setInterval(() => {
      playerObj.moveUp();
    }, 50);

    setTimeout(() => {
      clearInterval(jumpUp);
      let jumpDown = setInterval(() => {
        playerObj.moveDown();
      }, 50);
      setTimeout(() => {
        clearInterval(jumpDown);
      }, 1000);
    }, 1000);
  }
});
