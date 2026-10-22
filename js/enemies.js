class Enemies {
  constructor(speed) {
    // ENEMY PROPERTIES

    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "enemy";

    // POSITION AND DIMENSION

    this.x = 1120;
    this.y = 555;
    this.width = 40;
    this.height = 70;
    // INITIAL STYLES
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.backgroundColor = "pink";
    this.node.style.border = "solid black 2px";
    this.node.style.borderRadius = "5px";

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
