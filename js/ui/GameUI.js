// UI functions for different game screens

function drawGameUI() {
  // Set uniform padding from edges
  const padding = 20;
  
  // Create UI header bar (semi-transparent background)
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, width, 35);
  
  // Score display with glow - left aligned
  drawGlowText("SCORE: " + score, padding, 25, 18, color(0, 200, 255), LEFT);
  
  // Lives display - centered
  const livesX = width / 2;
  
  // "LIVES:" text - centered
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text("LIVES:", livesX - 30, 25);
  
  // Draw ship icons for lives in a row
  const shipSpacing = 20;
  for (let i = 0; i < lives; i++) {
    push();
    translate(livesX + (i * shipSpacing), 25);
    scale(0.6);
    ship.displayStatic();
    pop();
  }
  
  // Power-up status - right aligned
  if (powerUpActive) {
    let powerUpName = "";
    let powerUpColor;
    
    if (powerUpType === 'triple') {
      powerUpName = "TRIPLE SHOT";
      powerUpColor = color(255, 100, 100);
    } else if (powerUpType === 'score') {
      powerUpName = "2X SCORE";
      powerUpColor = color(255, 255, 0);
    } else if (powerUpType === 'shield') {
      powerUpName = "SHIELD";
      powerUpColor = color(0, 200, 255);
    }
    
    // Calculate remaining time
    let remainingTime = floor((powerUpTimer / 60) * 10) / 10;
    
    // Draw power-up status with glow - right aligned
    textAlign(RIGHT);
    drawGlowText(powerUpName + ": " + remainingTime + "s", width - padding, 25, 16, powerUpColor, RIGHT);
  }
}

function drawTitleScreen() {
  // Title with glow effect
  drawGlowText(gameTitle, width / 2, height / 3, 40, color(0, 200, 255));
  
  // Subtitle
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(gameSubtitle, width / 2, height / 3 + 40);
  
  // Instructions
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text("Arrow keys to move, SPACE to shoot", width / 2, height / 2 + 20);
  
  // Start prompt
  if (frameCount % 60 < 40) {
    fill(255, 255, 0);
    textSize(24);
    text("Press ANY KEY to start", width / 2, height * 0.7);
  }
}

function drawGameOverScreen() {
  // Game over text with glow
  drawGlowText("GAME OVER", width / 2, height / 3, 40, color(255, 50, 50));
  
  // Score
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("Final Score: " + score, width / 2, height / 2);
  
  // Play time - calculate only once when game ends
  if (!gameEndTime) {
    gameEndTime = millis();
  }
  let playTime = Math.floor((gameEndTime - gameStartTime) / 1000);
  textSize(18);
  text("Time survived: " + playTime + " seconds", width / 2, height / 2 + 30);
  
  // Warning for score of 0
  if (score <= 0) {
    fill(255, 100, 100);
    textSize(16);
    text("Score must be greater than 0 to submit to leaderboard", width / 2, height / 2 + 60);
  } else {
    // Social media prompt
    fill(0, 200, 255);
    textSize(16);
    text("Share your score on X!", width / 2, height / 2 + 60);
  }
  
  // Leaderboard button
  if (frameCount % 60 < 40) {
    if (score > 0) {
      fill(0, 255, 255);
      textSize(18);
      text("Press L to view leaderboard", width / 2, height * 0.6);
    }
  }
  
  // Restart prompt
  if (frameCount % 60 < 40) {
    fill(255, 255, 0);
    textSize(20);
    text("Press R to restart", width / 2, height * 0.7);
  }
}

function drawGlowText(txt, x, y, size, glowColor, alignment = CENTER) {
  textSize(size);
  textAlign(alignment);
  
  // Glow effect
  fill(glowColor);
  for (let i = 10; i > 0; i--) {
    let alpha = map(i, 0, 10, 255, 0);
    fill(red(glowColor), green(glowColor), blue(glowColor), alpha);
    text(txt, x, y);
  }
  
  // Main text
  fill(255);
  text(txt, x, y);
}
