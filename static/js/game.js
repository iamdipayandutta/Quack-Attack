const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas dynamically
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateGunPosition(); // Keep gun and flash in place
});

// Load assets
const background = new Image();
background.src = "static/images/duckhuntbackground.jpg";

const duckImage = new Image();
duckImage.src = "static/images/image.png";

const gunImage = document.createElement("img");
gunImage.src = "static/images/pngegg.png";
gunImage.classList.add("gun");
document.body.appendChild(gunImage);

const flash = document.createElement("div");
flash.classList.add("muzzle-flash");
document.body.appendChild(flash);

const gunshotSound = new Audio("static/sounds/glock19-18535.mp3");

// Game variables
const ducks = [];
const numDucks = 2;
let score = 0;
let lives = 3;
let wave = 1;
const maxWaves = 3;

// Create ducks
function spawnDucks() {
    for (let i = 0; i < numDucks; i++) {
        ducks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height / 2,
            speed: Math.random() * 2 + 2,
            direction: Math.random() < 0.5 ? 1 : -1
        });
    }
}
spawnDucks(); // Initialize first set of ducks

// Update gun and muzzle flash position
function updateGunPosition() {
    const gunRect = gunImage.getBoundingClientRect();
    flash.style.left = `${gunRect.left + gunRect.width / 2 - 25}px`; // Center flash
    flash.style.bottom = `110px`; // Fixed bottom position
}

// Update and draw game
function updateGame() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Update and draw ducks
    ducks.forEach((duck, index) => {
        duck.x += duck.speed * duck.direction;

        if (duck.x < 0 || duck.x > canvas.width) {
            duck.direction *= -1;
        }

        ctx.drawImage(duckImage, duck.x, duck.y, 80, 60);
    });

    // Display score and lives
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 30);
    ctx.fillText(`Wave ${wave} of ${maxWaves}`, canvas.width - 200, canvas.height - 20);

    requestAnimationFrame(updateGame);
}

// Shooting logic
canvas.addEventListener("click", (event) => {
    gunshotSound.currentTime = 0; // Reset sound for quick replay
    gunshotSound.play().catch(error => console.log(error)); // Prevent sound blocking issues

    // Show muzzle flash at fixed position
    updateGunPosition();
    flash.style.display = "block";
    setTimeout(() => {
        flash.style.display = "none";
    }, 50);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    ducks.forEach((duck, index) => {
        if (
            mouseX >= duck.x &&
            mouseX <= duck.x + 80 &&
            mouseY >= duck.y &&
            mouseY <= duck.y + 60
        ) {
            ducks.splice(index, 1);
            score += 100;
        }
    });

    // Respawn ducks for next wave
    if (ducks.length === 0) {
        if (wave < maxWaves) {
            wave++;
            spawnDucks();
        } else {
            alert("Game Over! Final Score: " + score);
        }
    }
});

// Start game loop
updateGame();
