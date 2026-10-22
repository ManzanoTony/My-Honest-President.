class Enemies {
  constructor(speed) {
    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "enemy";

    this.x = 1120;
    this.y = 340;
    this.width = 200;
    this.height = 300;

    const enemyImages = [
      "baby-woman.gif",
      "flip-man.gif",
      "hijab-woman.gif",
      "skate-man.gif",
      "woke-man.gif",
      "woke-woman.gif",
    ];

    let randomIndex = Math.floor(Math.random() * enemyImages.length);
    let chosenImage = enemyImages[randomIndex];

    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.backgroundImage = `url('images/enemies/${chosenImage}')`;
    this.node.style.backgroundSize = "contain";
    this.node.style.backgroundRepeat = "no-repeat";
    this.node.style.backgroundPosition = "bottom";

    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.speed = speed;
  }

  automaticMovement() {
    this.x -= this.speed;
    this.node.style.left = `${this.x}px`;
  }
}
