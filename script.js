const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let slowMode = false;
let startTime = 0;
let finalTime = 0;
let timerRunning = false;
let gameOver = false;
let gameStarted = false;
let missionSuccess = false;
let fuel = 100;
let maxFuel = 100;

const startButton = document.getElementById("startButton");

startButton.onclick = function () {

    startTime = Date.now();
    timerRunning = true;
    finalTime = 0;

    gameStarted = true;
    gameOver = false;
    missionSuccess = false;

    rocket.x = canvas.width / 2 - 30;
    rocket.y = 100;
    rocket.velocityY = 0;
    fuel = maxFuel;

    landingPad.x = Math.random() * (canvas.width - landingPad.width);

    startButton.blur();
};


const backgrounds = [
    "spaces.avif",
    "planet.jpg",
];

let currentBackground = 0;

const background = new Image();
background.src = backgrounds[currentBackground];

const backgroundButton = document.getElementById("backgroundButton");

backgroundButton.onclick = function() {

    currentBackground++;

    if (currentBackground >= backgrounds.length) {
        currentBackground = 0;
    }

    background.src = backgrounds[currentBackground];

};

const rocketImg = new Image();
rocketImg.src = "Rocket.png";

let rocket = {
    x: canvas.width / 2 - 30,
    y: 100,
    width: 60,
    height: 100,
    velocityY: 0
};

let gravity = 0.25;
let thrust = -0.5;

let spacePressed = false;

let landingPad = {
    x: canvas.width / 2 - 75,
    y: canvas.height - 180,
    width: 150,
    height: 20,
    speed: 3
};

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();
        spacePressed = true;

    }

});

document.addEventListener("keyup", function(event) {

    if (event.code === "Space") {

        spacePressed = false;

    }

});

function update() {


    if (!gameStarted || gameOver) {
        return;
    }

    landingPad.x += landingPad.speed;

    if (
        landingPad.x <= 0 ||
        landingPad.x + landingPad.width >= canvas.width
    ) {

        landingPad.speed *= -1;

    }

    rocket.velocityY += gravity;

   if (spacePressed && fuel > 0) {

    rocket.velocityY += thrust;

    fuel -= 0.5;

} else {

    if (fuel < maxFuel) {
        fuel += 0.1;
    }

}

    rocket.y += rocket.velocityY;

    if (
        rocket.y + rocket.height >= landingPad.y &&
        rocket.x + rocket.width > landingPad.x &&
        rocket.x < landingPad.x + landingPad.width
    ) {


        rocket.y = landingPad.y - rocket.height;

rocket.velocityY = 0;

finalTime = ((Date.now() - startTime) / 1000).toFixed(2);

timerRunning = false;

if (
    (finalTime >= 5 && finalTime < 6) ||
    (finalTime >= 10 && finalTime < 11)
) {

    missionSuccess = true;

} else {

    missionSuccess = false;

}

gameOver = true;

    }

}

function draw() {

    if (background.complete) {


        let scale = Math.max(
            canvas.width / background.width,
            canvas.height / background.height
        );

        let bgWidth = background.width * scale;
        let bgHeight = background.height * scale;

        let bgX = (canvas.width - bgWidth) / 2;
        let bgY = (canvas.height - bgHeight) / 2;

        ctx.drawImage(
            background,
            bgX,
            bgY,
            bgWidth,
            bgHeight
        );

    } else {

        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

    ctx.beginPath();

    ctx.arc(
        canvas.width / 2,
        canvas.height + 100,
        350,
        Math.PI,
        0
    );

    ctx.fillStyle = "gray";
    ctx.fill();

    ctx.fillStyle = "lime";

    ctx.fillRect(
        landingPad.x,
        landingPad.y,
        landingPad.width,
        landingPad.height
    );

    if (gameStarted && spacePressed) {


        let flameSize = Math.random() * 20 + 20;

        ctx.fillStyle = "orange";

        ctx.beginPath();

        ctx.moveTo(
            rocket.x + rocket.width / 2,
            rocket.y + rocket.height
        );

        ctx.lineTo(
            rocket.x + rocket.width / 2 - 15,
            rocket.y + rocket.height + flameSize
        );

        ctx.lineTo(
            rocket.x + rocket.width / 2 + 15,
            rocket.y + rocket.height + flameSize
        );

        ctx.fill();

        ctx.fillStyle = "yellow";

        ctx.beginPath();

        ctx.moveTo(
            rocket.x + rocket.width / 2,
            rocket.y + rocket.height
        );

        ctx.lineTo(
            rocket.x + rocket.width / 2 - 7,
            rocket.y + rocket.height + flameSize - 5
        );

        ctx.lineTo(
            rocket.x + rocket.width / 2 + 7,
            rocket.y + rocket.height + flameSize - 5
        );

        ctx.fill();

    }

    if (gameStarted) {

        ctx.drawImage(
            rocketImg,
            rocket.x,
            rocket.y,
            rocket.width,
            rocket.height
        );

    }

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    let currentTime = finalTime;

    if (timerRunning) {

        currentTime = ((Date.now() - startTime) / 1000).toFixed(2);

    }

    ctx.fillText(
        "Time: " + currentTime + "s",
        50,
        50
    );

    // Fuel bar

ctx.fillStyle = "white";
ctx.font = "25px Arial";

ctx.fillText(
    "Fuel",
    50,
    90
);


// Background bar
ctx.fillStyle = "gray";

ctx.fillRect(
    50,
    105,
    200,
    20
);
ctx.fillStyle = "lime";
ctx.fillRect(
    50,
    105,
    (fuel / maxFuel) * 200,
    20
);

    if (gameOver) {

        ctx.fillStyle = "rgba(0,0,0,0.7)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.font = "50px Arial";

        if (missionSuccess) {

            ctx.fillText(
                "MISSION COMPLETE 🚀",
                canvas.width / 2,
                canvas.height / 2 - 50
            );

        } else {

            ctx.fillText(
                "MISSION FAILED 💥",
                canvas.width / 2,
                canvas.height / 2 - 50
            );

        }

        ctx.font = "35px Arial";

        ctx.fillText(
            "Time: " + finalTime + "s",
            canvas.width / 2,
            canvas.height / 2 + 20
        );

    }

}

const restartButton = document.getElementById("restartButton");

restartButton.onclick = function() {

    rocket.x = canvas.width / 2 - 30;
    rocket.y = 100;
    rocket.velocityY = 0;
    fuel = maxFuel;

    landingPad.x = Math.random() * (canvas.width - landingPad.width);

    startTime = Date.now();
    timerRunning = true;
    finalTime = 0;

    gameOver = false;
    missionSuccess = false;
    gameStarted = true;

};

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);

}

const modal = document.getElementById("instructionModal");
const closeModal = document.getElementById("closeModal");

closeModal.onclick = function() {

    modal.style.display = "none";

};

gameLoop();

let fastMode = false;

const fastButton = document.getElementById("fastButton");

fastButton.onclick = function () {

    fastMode = !fastMode;

    if (fastMode) {

        landingPad.speed = 7;

        slowMode = false;
        slowButton.innerHTML = "Slow Mode";

        fastButton.innerHTML = "Fast Mode: ON";

    } else {

        landingPad.speed = 3;

        fastButton.innerHTML = "Fast Mode";

    }

};

const slowButton = document.getElementById("slowButton");

slowButton.onclick = function () {

    slowMode = !slowMode;

    if (slowMode) {

        landingPad.speed = 1;

        fastMode = false;
        fastButton.innerHTML = "Fast Mode";

        slowButton.innerHTML = "Slow Mode: ON";

    } else {

        landingPad.speed = 3;

        slowButton.innerHTML = "Slow Mode";

    }

};