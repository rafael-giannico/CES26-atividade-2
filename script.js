const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toggleSoundButton = document.getElementById('toggleSound');
let soundEnabled = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the airplane and missile images
const airplaneImage = new Image();
airplaneImage.src = 'aviao.png';

const missileImage = new Image();
missileImage.src = 'missil.png';

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

let missileDistanceFromAirplane = 100; // Distância fixa do míssil ao avião

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw airplane image
  ctx.drawImage(airplaneImage, airplane.x, airplane.y, airplane.width, airplane.height);

  // Calculate the position of the missile relative to the airplane
  let missileX = airplane.x + airplane.width / 2 + Math.cos(missile.angle) * missileDistanceFromAirplane;
  let missileY = airplane.y + airplane.height / 2 + Math.sin(missile.angle) * missileDistanceFromAirplane;

  // Draw missile image
  ctx.drawImage(missileImage, missileX, missileY, 30, 30); // You can adjust the size (30, 30) as needed

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

// Right-click to fire the missile
canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    audioEmg.play();
    if (!fire) {
        missile.src = 'assets/missile-hot.png';
        audioPlane.pause();
    }
    fire = true;
});


// Toggle sound on/off
document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyM') {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            audioPlane.play();
        } else {
            audioPlane.pause();
            audioBomb.pause();
            audioVouCair.pause();
            audioEmg.pause();
        }
    }
});