// Core game logic functions

function resetGame() {
  gameState = 'playing';
  score = 0;
  lives = 3;
  ship = new Ship();
  enemies = [];
  bullets = [];
  particles = [];
  frameCountSinceLastEnemy = 0;
  frameCountSinceLastShoot = 0;
  frameCountSinceLastPowerUp = 0;
  powerUpActive = false;
  powerUpTimer = 0;
  enemySpeed = 2;
  gameStartTime = millis();
  gameEndTime = null;
}

function activatePowerUp(type) {
  powerUpActive = true;
  powerUpType = type;
  powerUpTimer = 600; // 10 seconds (60 frames per second)
  
  // Visual feedback for power-up activation
  let powerUpColor;
  
  if (type === 'triple') {
    powerUpColor = color(255, 100, 100);
  } else if (type === 'score') {
    powerUpColor = color(255, 255, 0);
  } else if (type === 'shield') {
    powerUpColor = color(0, 200, 255);
  }
  
  // Create particles for power-up activation
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(ship.x, ship.y, powerUpColor));
  }
}

function keyPressed() {
  if (gameState === 'title') {
    gameState = 'playing';
    gameStartTime = millis();
    gameEndTime = null;
  } else if (gameState === 'gameover') {
    if (key === 'r' || key === 'R') {
      resetGame();
    } else if ((key === 'l' || key === 'L') && score > 0) {
      // Only open leaderboard if score is greater than 0
      if (window.parent) {
        window.parent.postMessage('openLeaderboard', '*');
      }
    }
  }
}

function drawStarryBackground() {
  // Draw animated stars
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    
    // Move stars downward
    star.pos.y += star.speed;
    
    // Reset stars that go off screen
    if (star.pos.y > height) {
      star.pos.y = 0;
      star.pos.x = random(width);
    }
    
    // Draw star with twinkle effect
    let twinkle = sin(frameCount * 0.1 + i) * 0.5 + 0.5;
    fill(255, 255, 255, 150 + twinkle * 100);
    noStroke();
    circle(star.pos.x, star.pos.y, star.size);
  }
}
