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

// AUDIO TRACKS & MUSIC MANAGEMENT

const selectScreenMusic = new Audio("Sound/select-screen.mp3");
selectScreenMusic.loop = true;
selectScreenMusic.volume = 0.1;

let currentBgMusic = null;    // Selection / Main Gameplay loop
let currentEndBgMusic = null; // Win/Loss background track
let currentVoiceLine = null;  // Win/Loss president voice line track

function playSelectScreenMusic() {
  stopAllAudio();
  selectScreenMusic.currentTime = 0;
  selectScreenMusic.play().catch((err) => console.log("Select screen music play error:", err));
}

function stopSelectScreenMusic() {
  selectScreenMusic.pause();
  selectScreenMusic.currentTime = 0;
}

function playBackgroundMusic(audioPath) {
  stopAllAudio(); // Clear all audio before starting a new track

  currentBgMusic = new Audio(audioPath);
  currentBgMusic.loop = true;
  currentBgMusic.volume = 0.1;
  currentBgMusic.play().catch((err) => console.log("Audio play error:", err));
}

function playEndScreenAudio(voicePath, bgMusicPath) {
  stopAllAudio(); // Clear gameplay music completely

  if (voicePath) {
    currentVoiceLine = new Audio(voicePath);
    currentVoiceLine.volume = 0.8;
    currentVoiceLine.play().catch((err) => console.log("Voice line audio error:", err));
  }

  if (bgMusicPath) {
    currentEndBgMusic = new Audio(bgMusicPath);
    currentEndBgMusic.loop = true;
    currentEndBgMusic.volume = 0.1;
    currentEndBgMusic.play().catch((err) => console.log("End background audio error:", err));
  }
}

function playHitSound() {
  let hitSound = null;

  if (selectedPresidentKey === "trump") {
    hitSound = new Audio("Sound/ouch-hit-trump.mp3");
  } else if (selectedPresidentKey === "putin") {
    hitSound = new Audio("Sound/putin-ouch.mp3");
  }

  if (hitSound) {
    hitSound.currentTime = 0; // Rewind so hits play cleanly
    hitSound.volume = 0.8;
    hitSound.play().catch((err) => console.log("Hit sound audio error:", err));
  }
}

function playMoneySound() {
  const moneySound = new Audio("Sound/money-sound.mp3");
  moneySound.currentTime = 0;
  moneySound.volume = 0.2;
  moneySound.play().catch((err) => console.log("Money sound audio error:", err));
}

function playJumpSound() {
  const jumpSound = new Audio("Sound/jump-sound.mp3");
  jumpSound.currentTime = 0;
  jumpSound.volume = 0.5;
  jumpSound.play().catch((err) => console.log("Jump sound audio error:", err));
}

function stopAllAudio() {
  stopSelectScreenMusic();

  if (currentBgMusic) {
    currentBgMusic.pause();
    currentBgMusic.currentTime = 0;
    currentBgMusic = null;
  }
  if (currentEndBgMusic) {
    currentEndBgMusic.pause();
    currentEndBgMusic.currentTime = 0;
    currentEndBgMusic = null;
  }
  if (currentVoiceLine) {
    currentVoiceLine.pause();
    currentVoiceLine.currentTime = 0;
    currentVoiceLine = null;
  }
}

// GLOBAL GAME VARIABLES

let playerObj = null;
let enemiesArr = [];
let bulletsArr = [];
let timeLeft = 60;
let gameIntervalId = null;
let enemySpawnIntervalId = null;
let timerIntervalId = null;
let canShoot = true;
let selectedPresidentKey = null; 

// GLOBAL GAME FUNCTIONS

function triggerWin() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  gameScreenNode.style.display = "none";
  winScreenNode.style.display = "flex";

  const winningImgNode = document.querySelector("#winning-president-img");

  if (selectedPresidentKey === "trump") {
    if (winningImgNode) winningImgNode.src = "images/trump/trump-winning.gif";
    // Plays Trump Win track and Trump Wins Background
    playEndScreenAudio("Sound/trump-win.mp3", "Sound/trump-wins-background.mp3");
  } else if (selectedPresidentKey === "putin") {
    if (winningImgNode) winningImgNode.src = "images/putin/putin-win.gif";
    // Plays Putin Win track and Putin Win Background
    playEndScreenAudio("Sound/putin-win.mp3", "Sound/putin-win-backgroud.mp3");
  }
}

function triggerLoss() {
  clearInterval(timerIntervalId);
  clearInterval(gameIntervalId);
  clearInterval(enemySpawnIntervalId);

  gameScreenNode.style.display = "none";
  looseScreenNode.style.display = "flex";

  const losingImgNode = document.querySelector("#losing-president-img");

  if (selectedPresidentKey === "trump") {
    if (losingImgNode) losingImgNode.src = "images/trump/trump-angry.gif";
    // Plays Trump Lose track and Lose Screen Background
    playEndScreenAudio("Sound/trump-loose.mp3", "Sound/loose-screen.mp3");
  } else if (selectedPresidentKey === "putin") {
    if (losingImgNode) losingImgNode.src = "images/putin/putin-loosing.gif";
    // Plays Putin Lose track and Lose Screen Background
    playEndScreenAudio("Sound/putin-loose.mp3", "Sound/loose-screen.mp3");
  }
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

  // Stop start screen music when character is chosen
  stopSelectScreenMusic();

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

  // Start background selection audio during play
  if (selectedPresidentKey === "trump") {
    playBackgroundMusic("Sound/trump-select.mp3");
  } else if (selectedPresidentKey === "putin") {
    playBackgroundMusic("Sound/putin-select.mp3");
  }

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

  // Stop all active game/end screen sounds and restart start screen music
  playSelectScreenMusic();

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
  startScreenNode.style.display = "flex";
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

      // Trigger character-specific hit sound effect
      playHitSound();

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

// Function to start the selection screen music
function tryStartSelectMusic() {
  if (startScreenNode.style.display !== "none" && !selectedPresidentKey) {
    playSelectScreenMusic();
  }
}

// Plays music when the select-screen is loaded
window.addEventListener("DOMContentLoaded", () => {
  tryStartSelectMusic();
});

// Fallback: If autoplay is blocked by browser policy, play on the first user interaction
window.addEventListener("click", function handleFirstInteraction() {
  if (!selectScreenMusic.paused) return; 
  tryStartSelectMusic();
  window.removeEventListener("click", handleFirstInteraction);
});

window.addEventListener("keydown", function handleFirstKeyInteraction() {
  if (!selectScreenMusic.paused) return; 
  tryStartSelectMusic();
  window.removeEventListener("keydown", handleFirstKeyInteraction);
});

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
      playMoneySound();
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
      playerObj.setJumpingImage();
      playJumpSound();

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
            playerObj.setRunningImage();

          }, 450);
        }, 100);
      }, 450);
    }
  }
});
