class Particle {
  constructor(x, y, particleColor = color(255, 150, 0)) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.size = random(2, 5);
    this.color = particleColor;
    this.lifespan = 255;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifespan -= 10;
  }
  
  display() {
    noStroke();
    
    // Create a glowing effect
    let c = this.color;
    let fadeAlpha = this.lifespan * 0.5;
    
    // Outer glow
    fill(red(c), green(c), blue(c), fadeAlpha * 0.5);
    circle(this.x, this.y, this.size * 2);
    
    // Inner glow
    fill(red(c), green(c), blue(c), fadeAlpha);
    circle(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.lifespan <= 0;
  }
}
