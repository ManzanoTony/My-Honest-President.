// Global DOM elements

const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#main-game-screen");
const characterSelectionNode = document.querySelector(".character-selection");
const winScreenNode = document.querySelector("#winning-screen");
const looseScreenNode = document.querySelector("#loosing-screen");
const gameBoxNode = document.querySelector("#game-box");

// Global game variables
let playerObj = null;

// Global game functions

function gameStart() {
  // This part will change the screens so we can start playing

  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // Game elements

  playerObj = new Player();

  // Main game interval

  //
}

// Event listeners

characterSelectionNode.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    gameStart();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    playerObj.moveUp();
  }
});
