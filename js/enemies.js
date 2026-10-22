class Enemies {
  constructor(speed) {
    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "enemy";

    this.x = 1120;
    this.y = 340;     // Same ground level as Trump
    this.width = 200; // Same size as Trump width
    this.height = 300;// Same size as Trump height

    // Array of all enemy image filenames
    const enemyImages = [
      "baby-woman.gif",
      "flip-man.gif",
      "hijab-woman.gif",
      "skate-man.gif",
      "woke-man.gif",
      "woke-woman.gif"
    ];

    // Pick a random index from the array
    let randomIndex = Math.floor(Math.random() * enemyImages.length);
    let chosenImage = enemyImages[randomIndex];

    // STYLES AND BACKGROUND IMAGE
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;

    this.node.style.backgroundImage = `url('../images/enemies/${chosenImage}')`;
    this.node.style.backgroundSize = "contain";
    this.node.style.backgroundRepeat = "no-repeat";
    this.node.style.backgroundPosition = "bottom";

    // INITIAL POSITIONS
    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.speed = speed;
  }

  // METHODS
  automaticMovement() {
    this.x -= this.speed;
    this.node.style.left = `${this.x}px`;
  }
}
