// CONFIGURATION FOR BOTH PRESIDENTS (Running, Jumping, Shooting)
const PRESIDENTS = {
  trump: {
    runningGif: "images/trump/trump-runing.gif",
    jumpingGif: "images/trump/trump-jumping.gif",
    shootingGif: "images/trump/trump-shoot.gif"
  },
  putin: {
    runningGif: "images/putin/putin-runing.gif",
    jumpingGif: "images/putin/putin-jumping.gif",
    shootingGif: "images/putin/putin-shoot.gif"
  }
};

class Player {
  constructor(characterData) {
    this.character = characterData; 

    this.node = document.createElement("div");
    gameBoxNode.append(this.node);
    this.node.className = "player";

    this.x = 100;
    this.y = 340;
    this.width = 200;
    this.height = 300;
    this.lives = 3;
    this.isJumping = false;
    this.isImmune = false;
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.setRunningImage();
    this.node.style.backgroundSize = "contain";
    this.node.style.backgroundRepeat = "no-repeat";
  }

  // ANIMATION STATES 
  setRunningImage() {
    this.node.style.backgroundImage = `url('${this.character.runningGif}')`;
  }

  setJumpingImage() {
    this.node.style.backgroundImage = `url('${this.character.jumpingGif}')`;
  }

  setShootingImage() {
    this.node.style.backgroundImage = `url('${this.character.shootingGif}')`;
  }


  moveUp() {
    this.y -= 18;
    this.node.style.top = `${this.y}px`;
  }

  moveDown() {
    this.y += 18;
    if (this.y >= 340) {
      this.y = 340;
      this.isJumping = false;
      this.setRunningImage(); // Return to running when landing
    }
    this.node.style.top = `${this.y}px`;
  }

  shoot() {
    //  Temporarily set the shooting sprite
    this.setShootingImage();

    //  Spawn the money projectile from hand/chest height
    let bulletX = this.x + 150; 
    let bulletY = this.y + 190; 
    
    let newBullet = new Bullet(bulletX, bulletY);
    bulletsArr.push(newBullet);

    // Revert back to running sprite after 300ms (unless jumping)
    setTimeout(() => {
      if (playerObj && !playerObj.isJumping) {
        this.setRunningImage();
      }
    }, 300);
  }
} 

// BULLETS

class Bullet {
  constructor(x, y) {
    this.node = document.createElement("div");
    
    const gameBox = document.querySelector("#game-box");
    if (gameBox) {
      gameBox.append(this.node);
    }

    this.node.className = "bullet";

    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 40;
    this.speed = 5;

    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }

  moveForward() {
    this.x += this.speed;
    this.node.style.left = `${this.x}px`;
  }
}
