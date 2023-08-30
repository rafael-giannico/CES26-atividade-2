const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toggleSoundButton = document.getElementById('toggleSound');
let soundEnabled = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let airplane = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 50,
  height: 50,
};

let missile = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0,
  speed: 5,
  fired: false,
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw airplane
  ctx.fillStyle = 'blue';
  ctx.fillRect(airplane.x, airplane.y, airplane.width, airplane.height);

  // Draw missile
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(missile.x, missile.y);
  ctx.lineTo(
    missile.x + Math.cos(missile.angle) * 20,
    missile.y + Math.sin(missile.angle) * 20
  );
  ctx.stroke();

  if (missile.fired) {
    missile.x += Math.cos(missile.angle) * missile.speed;
    missile.y += Math.sin(missile.angle) * missile.speed;

    // Check for collision
    if (
      missile.x > airplane.x &&
      missile.x < airplane.x + airplane.width &&
      missile.y > airplane.y &&
      missile.y < airplane.y + airplane.height
    ) {
      missile.fired = false;
      playExplosionSound();
      alert('Airplane hit! Game over.');
    }
  }

  requestAnimationFrame(draw);
}

function onMouseMove(event) {
  airplane.x = event.clientX - airplane.width / 2;
  airplane.y = event.clientY - airplane.height / 2;

  missile.angle = Math.atan2(
    airplane.y + airplane.height / 2 - missile.y,
    airplane.x + airplane.width / 2 - missile.x
  );

  if (!missile.fired) {
    missile.x = airplane.x + airplane.width / 2;
    missile.y = airplane.y + airplane.height / 2;
  }
}

function onMouseClick(event) {
  if (event.button === 2) {
    missile.fired = true;
  }
}

function playExplosionSound() {
  if (soundEnabled) {
    // Add code to play explosion sound here
  }
}

toggleSoundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  toggleSoundButton.textContent = soundEnabled ? 'Disable Sound' : 'Enable Sound';
});

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseClick);

draw();