class Enemy {
  constructor(x, y, type = 'neural') {
    this.x = x;
    this.y = y;
    this.r = 15; 
    this.type = type;
    this.speed = enemySpeed;
    
    // Set health and color based on type
    if (this.type === 'neural') {
      this.color = color(255, 100, 100);
      this.health = 1;
    } else if (this.type === 'robot') {
      this.color = color(100, 255, 100);
      this.health = 2;  // Robot enemies take 2 hits
    } else if (this.type === 'quantum') {
      this.color = color(200, 100, 255);
      this.health = 1;
      this.speed *= 1.5;
    }
  }
  
  update() {
    this.y += this.speed;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Draw enemy based on type
    if (this.type === 'neural') {
      // Neural network-like enemy
      fill(this.color);
      noStroke();
      ellipse(0, 0, this.r * 2, this.r * 2);
      
      // Draw "neural connections"
      stroke(255);
      strokeWeight(1);
      for (let i = 0; i < 4; i++) {
        let angle = i * PI / 2;
        line(0, 0, cos(angle) * this.r, sin(angle) * this.r);
      }
      
      // Draw inner circle
      fill(255);
      noStroke();
      ellipse(0, 0, this.r * 0.5, this.r * 0.5);
      
    } else if (this.type === 'robot') {
      // Robot-like enemy - show damage state
      // Darker color when damaged
      if (this.health < 2) {
        fill(80, 200, 80); // Darker green when damaged
      } else {
        fill(this.color);
      }
      
      noStroke();
      rect(-this.r, -this.r, this.r * 2, this.r * 2);
      
      // Draw "eyes"
      fill(255);
      rect(-this.r * 0.6, -this.r * 0.6, this.r * 0.4, this.r * 0.4);
      rect(this.r * 0.2, -this.r * 0.6, this.r * 0.4, this.r * 0.4);
      
      // Draw "mouth" - changes when damaged
      if (this.health < 2) {
        // Angry mouth when damaged
        fill(255, 100, 100);
      } else {
        fill(255);
      }
      rect(-this.r * 0.6, this.r * 0.2, this.r * 1.2, this.r * 0.4);
      
    } else if (this.type === 'quantum') {
      // Quantum-like enemy
      fill(this.color);
      noStroke();
      
      // Draw main shape (hexagon)
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = i * TWO_PI / 6;
        vertex(cos(angle) * this.r, sin(angle) * this.r);
      }
      endShape(CLOSE);
      
      // Draw inner details
      stroke(255);
      strokeWeight(1);
      noFill();
      ellipse(0, 0, this.r, this.r);
      
      // Draw "quantum particles"
      fill(255);
      noStroke();
      for (let i = 0; i < 3; i++) {
        let angle = i * TWO_PI / 3 + frameCount * 0.05;
        ellipse(cos(angle) * this.r * 0.5, sin(angle) * this.r * 0.5, 4, 4);
      }
    }
    
    pop();
  }
  
  hits(ship) {
    // Calculate distance between enemy and ship
    let d = dist(this.x, this.y, ship.x, ship.y);
    
    // Check if enemy and ship are overlapping
    // Use a slightly smaller collision radius for better gameplay
    return d < (this.r + 10);
  }
  
  hitByBullet(bullet) {
    // Calculate distance between enemy and bullet
    let d = dist(this.x, this.y, bullet.x, bullet.y);
    
    // Check if enemy and bullet are overlapping
    return d < (this.r + bullet.r);
  }
  
  offscreen() {
    return this.y > height + this.r;
  }
}
