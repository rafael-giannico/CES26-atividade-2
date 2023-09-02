const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const explosionSound = document.getElementById("explosionSound");

let airplane = new Image();
let missile = new Image();

let airplaneX, airplaneY;
let missileX, missileY;
let missileFired = false;
let soundEnabled = true;

let speed = 5;
let closeDistance = 50;

airplane.src = "aviao.png";
missile.src = "missil.png";

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

    ctx.drawImage(airplane, airplaneX, airplaneY, 100, 100);

    let delta = Math.atan((airplaneX - missileX) / (missileY - airplaneY));
    let angleInRadians = Math.PI / 2 + delta;

    if (missileFired) {
        missileX += speed * Math.cos(delta);
        missileY += speed * Math.sin(delta);

        if (
            airplaneX < missileX + 100 &&
            airplaneX + 100 > missileX &&
            airplaneY < missileY + 100 &&
            airplaneY + 100 > missileY
        ) {
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
    ctx.drawImage(missile, -50, -50, 100, 100);
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