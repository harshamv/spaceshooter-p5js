class Bullet {
  constructor(x, y, angle = 0) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.speed = 10;
    // We'll ignore the angle parameter and always shoot straight up
  }
  
  update() {
    // Move straight up (negative y direction)
    this.y -= this.speed;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Bullet glow
    noStroke();
    fill(0, 200, 255, 100);
    ellipse(0, 0, this.r * 3, this.r * 3);
    
    // Bullet core
    fill(255);
    ellipse(0, 0, this.r * 2, this.r * 2);
    
    pop();
  }
  
  offscreen() {
    return this.y < -this.r || this.y > height + this.r || this.x < -this.r || this.x > width + this.r;
  }
}
