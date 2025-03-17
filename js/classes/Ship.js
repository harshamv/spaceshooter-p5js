class Ship {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.speed = 5;
    this.width = 30;
    this.height = 40;
    this.collisionRadius = 15; // Radius for collision detection
    this.shieldActive = false;
  }
  
  update() {
    // Move left
    if (keyIsDown(LEFT_ARROW)) {
      this.x = max(this.width / 2, this.x - this.speed);
    }
    
    // Move right
    if (keyIsDown(RIGHT_ARROW)) {
      this.x = min(width - this.width / 2, this.x + this.speed);
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Draw shield if active
    if (this.shieldActive) {
      noFill();
      stroke(0, 200, 255, 150 + sin(frameCount * 0.1) * 50);
      strokeWeight(2);
      ellipse(0, 0, this.width * 1.5, this.height * 1.5);
    }
    
    // Ship body
    fill(0, 150, 255);
    noStroke();
    
    // Main body
    beginShape();
    vertex(0, -this.height / 2); // Nose
    vertex(-this.width / 2, this.height / 2 - 10); // Left bottom corner
    vertex(-this.width / 4, this.height / 4); // Left indent
    vertex(0, this.height / 2); // Bottom middle
    vertex(this.width / 4, this.height / 4); // Right indent
    vertex(this.width / 2, this.height / 2 - 10); // Right bottom corner
    endShape(CLOSE);
    
    // Cockpit
    fill(200, 230, 255);
    ellipse(0, -this.height / 6, this.width / 3, this.height / 4);
    
    // Engine glow
    fill(255, 100, 0, 150 + sin(frameCount * 0.2) * 50);
    ellipse(-this.width / 4, this.height / 3, 8, 12);
    ellipse(this.width / 4, this.height / 3, 8, 12);
    
    // Wing details
    fill(0, 100, 200);
    rect(-this.width / 2, 0, this.width / 6, this.height / 3);
    rect(this.width / 2 - this.width / 6, 0, this.width / 6, this.height / 3);
    
    pop();
  }
  
  // Static version for UI
  displayStatic() {
    // Ship body
    fill(0, 150, 255);
    noStroke();
    
    // Main body (simplified for UI)
    beginShape();
    vertex(0, -10); // Nose
    vertex(-10, 10); // Left bottom
    vertex(0, 5); // Bottom middle
    vertex(10, 10); // Right bottom
    endShape(CLOSE);
    
    // Cockpit
    fill(200, 230, 255);
    ellipse(0, -3, 5, 4);
  }
  
  shoot() {
    if (powerUpActive && powerUpType === 'triple') {
      // Triple shot power-up
      return [
        new Bullet(this.x - 10, this.y - this.height/2), // Left bullet
        new Bullet(this.x, this.y - this.height/2),      // Center bullet
        new Bullet(this.x + 10, this.y - this.height/2)  // Right bullet
      ];
    } else {
      // Normal shot
      return [new Bullet(this.x, this.y - this.height/2)];
    }
  }
}
