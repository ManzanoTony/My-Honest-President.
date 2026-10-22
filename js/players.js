class Player {
  constructor() {
    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "player";

    this.x = 75;
    this.y = 545;
    this.width = 50;
    this.height = 80;

    this.isJumping = false;
    this.lives = 3;
    this.isImmune = false; 

    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.backgroundColor = "orange";
    this.node.style.border = "solid yellow 2px";
    this.node.style.borderRadius = "5px";

    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.speed = 150;
  }

  moveUp() {
    this.y -= 13;
    this.node.style.top = `${this.y}px`;
  }

  moveDown() {
    this.y += 13;
    this.node.style.top = `${this.y}px`;
  }

  shoot() {
    let newBullet = new Bullet(this.x, this.y);
    bulletsArr.push(newBullet);
  }
}

class Bullet {
  constructor(playerX, playerY) {
    this.width = 25;
    this.height = 15;
    this.x = playerX + 50; 
    this.y = playerY + 30; 

    this.node = document.createElement("div");
    this.node.className = "money-bullet"; 

    gameBoxNode.append(this.node);
    this.updatePosition();
  }

  moveForward() {
    this.x += 8; 
    this.updatePosition();
  }

  updatePosition() {
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }
}
