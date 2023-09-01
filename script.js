const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const airplaneSound = document.getElementById("airplaneSound");
const explosionSound = document.getElementById("explosionSound");

let airplane = new Image();
let missile = new Image();

let airplaneX, airplaneY;
let missileX, missileY;
let missileFired = false;
let soundEnabled = true;

let speed = 5;
let closeDistance = 20;  // Reduzido para coincidir com o tamanho ainda menor do avião e do míssil

airplane.src = "aviao.png";
missile.src = "missil.png";

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        airplaneSound.play();
    } else {
        airplaneSound.pause();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    missileX = canvas.width / 2;
    missileY = canvas.height - 50;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (soundEnabled && !airplaneSound.paused) {
        airplaneSound.play();
    }

    ctx.drawImage(airplane, airplaneX, airplaneY, airplane.width * 0.5, airplane.height * 0.5);

    let delta = Math.atan((airplaneX - missileX) / (missileY - airplaneY));
    let angleInRadians = Math.PI / 2 + delta;

    if (missileFired) {
        let tipX = missileX + (missile.width * 0.5 * 0.5) * Math.sin(angleInRadians);  // Consider the tip of the missile
        let tipY = missileY - (missile.height * 0.5 * 0.5) * Math.cos(angleInRadians); // Consider the tip of the missile

        if (missileY - airplaneY < 0) {
            angleInRadians += Math.PI;
        }

        if (missileY - airplaneY < 0) {
            missileX -= speed * Math.sin(delta);
            missileY += speed * Math.cos(delta);
        } else {
            missileX += speed * Math.sin(delta);
            missileY -= speed * Math.cos(delta);
        }

        let distance = Math.sqrt(Math.pow(airplaneX - tipX, 2) + Math.pow(airplaneY - tipY, 2));

        if (distance < closeDistance) {
            if (soundEnabled) {
                explosionSound.play();
            }

            // Reset
            missileFired = false;
            missileX = canvas.width / 2;
            missileY = canvas.height - 50;
            airplaneX = canvas.width / 2;
            airplaneY = 50;
        }
    }

    ctx.save();
    ctx.translate(missileX, missileY);
    ctx.rotate(angleInRadians);
    ctx.drawImage(missile, -missile.width * 0.25, -missile.height * 0.25, missile.width * 0.5, missile.height * 0.5);
    ctx.restore();

    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", function(event) {
    airplaneX = event.clientX - canvas.offsetLeft - (airplane.width * 0.5) / 2;
    airplaneY = event.clientY - canvas.offsetTop - (airplane.height * 0.5) / 2;
});

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    missileFired = true;
});

update();