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
let closeDistance = 50;  // Ajustado para a nova dimensão das imagens

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

    ctx.drawImage(airplane, airplaneX, airplaneY, 100, 100);  // Tamanho fixo em 100x100 pixels

    let delta = Math.atan((airplaneX - missileX) / (missileY - airplaneY));
    let angleInRadians = Math.PI / 2 + delta;

    if (missileFired) {
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

        let distance = Math.sqrt(Math.pow(airplaneX + 50 - missileX, 2) + Math.pow(airplaneY + 50 - missileY, 2));

        if (distance < closeDistance) {
            if (soundEnabled) {
                explosionSound.play();
            }

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
    ctx.drawImage(missile, -50, -50, 150, 150);
    ctx.restore();

    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", function(event) {
    airplaneX = event.clientX - canvas.offsetLeft - 50;
    airplaneY = event.clientY - canvas.offsetTop - 50;
});

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    missileFired = true;
});

update();