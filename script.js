let mouseX = 0;
let mouseY = 0;
let speed = 5;
let closeDistance = 20;
let fire = false;
let catched = false;
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

let hold_x;
let hold_y;

const audioPlane = document.getElementById('plane');
const audioBomb = document.getElementById('bomb');

audioPlane.addEventListener('ended', () => {
    audioPlane.play();
});

audioPlane.onload = audioPlane.play;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hold_x = canvas.width/2 - 75;
    hold_y = canvas.height - 90;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
const plane = new Image();
const missile = new Image();

plane.src = 'aviao.png';
missile.src = 'missil.png';


function drawPlane() {
    if(!catched){
        ctx.drawImage(plane, mouseX - 75, mouseY - (50), 150, 100);
    }
    else {
        ctx.drawImage(plane, hold_x - 75, hold_y - 50, 150, 100);
        if(hold_y < canvas.height + 100) hold_y += 2;
        else {
            catched = false;
            fire = false;
            missile.src = 'missil.png';
            plane.src = 'aviao.png';
            resizeCanvas()
            audioPlane.play();    
        }

    }
}

function drawMissile() {
    delta = Math.atan((mouseX - hold_x)/(hold_y - mouseY));
    const angleInDegrees = -90;
    var angleInRadians = angleInDegrees * (Math.PI / 180) + delta;

    if(hold_y - mouseY < 0) angleInRadians += -Math.PI;

    if(fire) {
        if(hold_y - mouseY < 0) {
            hold_x -= speed * Math.sin(delta);
            hold_y += speed * Math.cos(delta);
        }
        else {
            hold_x += speed * Math.sin(delta);
            hold_y -= speed * Math.cos(delta);
        }
        if(hold_x > canvas.width || hold_x < 0 || hold_y > canvas.height || hold_y < 0) {
            hold_x = canvas.width/2 - 75;
            hold_y = canvas.height - 70;
            fire = false;
        }
    }

    ctx.save();
    ctx.translate(hold_x, hold_y);
    ctx.rotate(angleInRadians);
    ctx.drawImage(missile, -75, -50, 150, 100);
    ctx.restore();
}

plane.addEventListener('load', () => drawPlane(plane));
missile.addEventListener('load', () => drawMissile(missile));

canvas.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop; 
});


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPlane(plane);
    if(!fire || !catched) {
        drawMissile(missile);
    }

    if(fire && !catched) {
        if(Math.abs(hold_x - mouseX) < closeDistance && Math.abs(hold_y - mouseY) < closeDistance) {
            catched = true;
            audioBomb.play();
            }
    }

    requestAnimationFrame(update);
};

requestAnimationFrame(update);


canvas.addEventListener("contextmenu", function(event) {
  event.preventDefault();
  missileFired = true;
});