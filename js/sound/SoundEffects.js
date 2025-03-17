// Sound effect functions
function playShootSound() {
  if (!shootOsc) {
    shootOsc = new p5.Oscillator('sine');
  }
  shootOsc.freq(880);
  shootOsc.amp(0.1, 0);
  shootOsc.amp(0, 0.1);
  shootOsc.start();
}

function playExplosionSound() {
  if (!explosionOsc) {
    explosionOsc = new p5.Oscillator('sawtooth');
  }
  explosionOsc.freq(random(150, 200));
  explosionOsc.amp(0.2, 0);
  explosionOsc.amp(0, 0.5);
  explosionOsc.start();
}

function playHitSound() {
  if (!hitOsc) {
    hitOsc = new p5.Oscillator('square');
  }
  hitOsc.freq(440);
  hitOsc.amp(0.1, 0);
  hitOsc.amp(0, 0.1);
  hitOsc.start();
}
