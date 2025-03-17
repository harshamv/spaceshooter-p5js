// Global variables
let gameState = 'title';
let lastGameState = '';
let score = 0;
let lives = 3;
let ship;
let enemies = [];
let bullets = [];
let particles = [];
let stars = [];
let enemyGenerationInterval = 80; // Slightly slower initial enemy generation
let frameCountSinceLastEnemy = 0;
let shootCooldown = 10;
let frameCountSinceLastShoot = 0;
let shootOsc, explosionOsc, hitOsc;
let powerUps = [];
let powerUpGenerationInterval = 300; // Generate power-up every 5 seconds (300 frames)
let frameCountSinceLastPowerUp = 0;
let gameFont;
let enemyTypes = ['neural', 'robot', 'quantum'];
let gameTitle = "AI SPACE DEFENDER";
let gameSubtitle = "Battle Against Rogue AI";
let powerUpActive = false;
let powerUpTimer = 0;
let powerUpType = '';
let gameStartTime;
let gameEndTime;
let enemySpeed = 1.5; // Slightly slower initial enemy speed
let enemySpeedIncreaseInterval = 1000; // Increase speed every 1000 frames

function preload() {
  // You can add font loading here if needed
  // gameFont = loadFont('path/to/font.ttf');
}

function setup() {
  // Create canvas inside the game-container div
  let canvas = createCanvas(400, 600);
  canvas.parent('game-container');
  
  ship = new Ship();
  gameStartTime = millis();
  
  // Generate stars for background with varying sizes
  for (let i = 0; i < 150; i++) {
    stars.push({
      pos: createVector(random(width), random(height)),
      size: random(0.5, 2.5),
      speed: random(0.2, 1)
    });
  }
  
  // Set text properties
  textAlign(CENTER, CENTER);
  
  // Initialize oscillators for sound
  shootOsc = new p5.Oscillator('sine');
  explosionOsc = new p5.Oscillator('sawtooth');
  hitOsc = new p5.Oscillator('square');
}

function draw() {
  background(0);
  
  // Draw animated starry background
  drawStarryBackground();

  if (gameState === 'title') {
    // Title screen
    drawTitleScreen();
    
    // Notify parent window about game state
    if (window.parent && gameState !== lastGameState) {
      window.parent.postMessage('title', '*');
      lastGameState = gameState;
    }
  } else if (gameState === 'playing') {
    // Handle keyboard input for ship movement
    // (Ship class now handles movement internally with update())
    
    // Update ship based on shield power-up
    if (powerUpActive && powerUpType === 'shield') {
      ship.shieldActive = true;
    } else {
      ship.shieldActive = false;
    }
    
    // Update ship position
    ship.update();
    
    // Handle shooting
    if (keyIsDown(32) && frameCountSinceLastShoot >= shootCooldown) { // Spacebar
      // Get bullets from ship's shoot method
      let newBullets = ship.shoot();
      bullets = bullets.concat(newBullets);
      
      // Play shoot sound
      playShootSound();
      
      // Reset cooldown
      frameCountSinceLastShoot = 0;
    }
    
    frameCountSinceLastShoot++;
    
    // Notify parent window about game state
    if (window.parent && gameState !== lastGameState) {
      window.parent.postMessage('playing', '*');
      lastGameState = gameState;
    }
    
    // Display ship
    ship.display();
    
    // Generate enemies
    frameCountSinceLastEnemy++;
    if (frameCountSinceLastEnemy >= enemyGenerationInterval) {
      // Random enemy type
      let enemyType = random(enemyTypes);
      enemies.push(new Enemy(random(width), 0, enemyType));
      frameCountSinceLastEnemy = 0;
      
      // Gradually decrease enemy generation interval (increase difficulty)
      enemyGenerationInterval = max(30, enemyGenerationInterval - 0.05); // Slower difficulty increase
    }
    
    // Generate power-ups
    frameCountSinceLastPowerUp++;
    if (frameCountSinceLastPowerUp >= powerUpGenerationInterval) {
      powerUps.push(new PowerUp(random(50, width - 50), 0));
      frameCountSinceLastPowerUp = 0;
    }
    
    // Update and display bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      bullets[i].display();
      
      // Remove bullets that go off screen
      if (bullets[i].offscreen()) {
        bullets.splice(i, 1);
      }
    }
    
    // Update and display enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      // Skip if the enemy has already been removed
      if (!enemies[i]) continue;
      
      enemies[i].update();
      enemies[i].display();
      
      // Check for collision with ship
      if (enemies[i].hits(ship)) {
        // Create explosion particles
        for (let j = 0; j < 20; j++) {
          particles.push(new Particle(enemies[i].x, enemies[i].y, enemies[i].color));
        }
        
        // Remove enemy
        enemies.splice(i, 1);
        
        // If shield is active, don't lose a life
        if (!(powerUpActive && powerUpType === 'shield')) {
          lives--;
          
          // Create explosion particles for ship
          for (let j = 0; j < 15; j++) {
            particles.push(new Particle(ship.x, ship.y, color(0, 150, 255)));
          }
          
          // Play explosion sound
          playExplosionSound();
          
          // Check for game over
          if (lives <= 0) {
            gameState = 'gameover';
            gameEndTime = millis();
          }
        } else {
          // Shield absorbed the hit - create shield particles
          for (let j = 0; j < 10; j++) {
            particles.push(new Particle(ship.x, ship.y, color(0, 200, 255)));
          }
        }
        
        continue;
      }
      
      // Remove enemies that go off screen
      if (enemies[i].offscreen()) {
        enemies.splice(i, 1);
        
        // Player loses a life if enemy gets past them
        if (gameState === 'playing') {
          lives--;
          
          // Check for game over
          if (lives <= 0) {
            gameState = 'gameover';
            gameEndTime = millis();
          }
        }
        
        continue;
      }
    }
    
    // Handle bullet-enemy collisions separately to avoid array modification issues
    // Process all bullets first
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bulletRemoved = false;
      
      // Check collision with each enemy
      for (let i = enemies.length - 1; i >= 0; i--) {
        // Skip if we've already removed this bullet or enemy
        if (bulletRemoved || !enemies[i] || !bullets[j]) continue;
        
        if (enemies[i].hitByBullet(bullets[j])) {
          // Reduce enemy health
          enemies[i].health--;
          
          // Remove bullet
          bullets.splice(j, 1);
          bulletRemoved = true;
          
          // If enemy health is 0, remove enemy and add score
          if (enemies[i].health <= 0) {
            // Create explosion particles
            for (let k = 0; k < 15; k++) {
              particles.push(new Particle(enemies[i].x, enemies[i].y, enemies[i].color));
            }
            
            // Add score (double if power-up is active)
            if (powerUpActive && powerUpType === 'score') {
              score += 20;
            } else {
              score += 10;
            }
            
            // Play explosion sound
            playExplosionSound();
            
            // Remove enemy
            enemies.splice(i, 1);
          } else {
            // Play hit sound
            playHitSound();
            
            // Add visual feedback for hit
            for (let k = 0; k < 5; k++) {
              particles.push(new Particle(enemies[i].x, enemies[i].y, color(255, 255, 255)));
            }
          }
        }
      }
    }
    
    // Update and display power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].update();
      powerUps[i].display();
      
      // Check for collision with ship
      if (powerUps[i].hits(ship)) {
        // Activate power-up
        activatePowerUp(powerUps[i].type);
        
        // Remove power-up
        powerUps.splice(i, 1);
        
        continue;
      }
      
      // Remove power-ups that go off screen
      if (powerUps[i].offscreen()) {
        powerUps.splice(i, 1);
      }
    }
    
    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();
      
      // Remove dead particles
      if (particles[i].isDead()) {
        particles.splice(i, 1);
      }
    }
    
    // Update power-up timer
    if (powerUpActive) {
      powerUpTimer--;
      if (powerUpTimer <= 0) {
        powerUpActive = false;
        powerUpType = '';
      }
    }
    
    // Increase enemy speed over time
    if (frameCount % enemySpeedIncreaseInterval === 0) {
      enemySpeed = min(4, enemySpeed + 0.05); // Slower speed increase, lower max speed
    }
    
    // Display UI
    drawGameUI();
  } else if (gameState === 'gameover') {
    // Game over screen
    drawGameOverScreen();
    
    // Notify parent window about game state and score for sharing
    if (gameState !== lastGameState) {
      // Make score and time available globally for sharing
      window.score = score;
      window.gameStartTime = gameStartTime;
      window.gameEndTime = gameEndTime;
      
      // Send message to parent window
      if (score <= 0) {
        // If score is 0, skip the form and go directly to leaderboard
        window.parent.postMessage('showLeaderboardDirectly', '*');
      } else {
        // Normal game over with positive score
        window.parent.postMessage('gameover', '*');
      }
      console.log('Game over message sent, score:', score);
      
      lastGameState = gameState;
    }
  }
}
