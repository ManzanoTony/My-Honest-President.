class Player {
  constructor() {
    // players properties
    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "player";

    // POSITION AND DIMENSION

    this.x = 10;
    this.y = 515;
    this.width = 50;
    this.height = 80;
    // initial styles
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.backgroundColor = "orange";
    this.node.style.border = "solid yellow 2px";
    this.node.style.borderRadius = "5px";

    // INITIAL POSITIONS

    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.speed = 150;
  }

  // METHODS

  moveUp() {
    this.y -= 2;
    this.node.style.top = `${this.y}px`;
  }
  moveDown() {
    this.y += 2;
    this.node.style.top = `${this.y}px`;
  }
}
