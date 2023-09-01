const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let airplane = new Image();
let missile = new Image();
let airplaneSound = new Audio("aviao.mp3");
let explosionSound = new Audio("explosao.mp3");

let airplaneX = 0;
let airplaneY = 0;
let missileX = canvas.width / 2;
let missileY = canvas.height - 50;
let missileFired = false;
let soundEnabled = true;

airplane.src = "aviao.png";
missile.src = "missil.png";

function toggleSound() {
    soundEnabled = !soundEnabled;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (soundEnabled) {
        airplaneSound.play();
    }

    // Draw airplane and missile
    ctx.drawImage(airplane, airplaneX, airplaneY);
    ctx.drawImage(missile, missileX, missileY);

    // Fire missile
    if (missileFired) {
        let dx = airplaneX - missileX;
        let dy = airplaneY - missileY;
        let distance = Math.sqrt(dx*dx + dy*dy);

        missileX += dx / distance;
        missileY += dy / distance;

        if (distance < 50) {
            if (soundEnabled) {
                explosionSound.play();
            }
            // Reset
            missileFired = false;
            missileX = canvas.width / 2;
            missileY = canvas.height - 50;
        }
    }

    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", function(event) {
    airplaneX = event.clientX - canvas.offsetLeft - airplane.width / 2;
    airplaneY = event.clientY - canvas.offsetTop - airplane.height / 2;
});

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    missileFired = true;
});

update();