class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.type = random(['triple', 'score', 'shield']);
    this.angle = 0;
  }
  
  update() {
    this.y += 1.5;
    this.angle += 0.05;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    // Base shape
    noStroke();
    
    // Different colors and icons for different power-up types
    if (this.type === 'triple') {
      // Triple shot power-up
      fill(255, 100, 100);
      
      // Diamond shape
      beginShape();
      vertex(0, -this.r);
      vertex(this.r, 0);
      vertex(0, this.r);
      vertex(-this.r, 0);
      endShape(CLOSE);
      
      // Triple shot icon
      stroke(255);
      strokeWeight(2);
      line(-5, 0, -5, -7);
      line(0, 0, 0, -7);
      line(5, 0, 5, -7);
      
    } else if (this.type === 'score') {
      // Double score power-up
      fill(255, 255, 0);
      
      // Hexagon shape
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = cos(angle) * this.r;
        let y = sin(angle) * this.r;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // 2X icon
      fill(0);
      textSize(10);
      textAlign(CENTER, CENTER);
      text("2X", 0, 0);
      
    } else if (this.type === 'shield') {
      // Shield power-up
      fill(0, 200, 255);
      
      // Circle shape
      ellipse(0, 0, this.r * 2, this.r * 2);
      
      // Shield icon
      noFill();
      stroke(255);
      strokeWeight(2);
      arc(0, 0, this.r * 1.2, this.r * 1.2, PI + QUARTER_PI, TWO_PI + QUARTER_PI);
    }
    
    // Glowing effect
    noFill();
    if (this.type === 'triple') {
      stroke(255, 100, 100, 150);
    } else if (this.type === 'score') {
      stroke(255, 255, 0, 150);
    } else if (this.type === 'shield') {
      stroke(0, 200, 255, 150);
    }
    
    strokeWeight(2);
    ellipse(0, 0, this.r * 2.5, this.r * 2.5);
    
    pop();
  }
  
  offscreen() {
    return this.y > height + this.r;
  }
  
  hits(ship) {
    let d = dist(this.x, this.y, ship.x, ship.y);
    return d < this.r + 15; // Ship size approximation
  }
}
