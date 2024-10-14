// Get the canvas and context
const canvas = document.getElementById("flappyBirdCanvas");
const ctx = canvas.getContext("2d");

// Load the cat sprite sheet
const catSpriteSheet = new Image();
catSpriteSheet.src = 'WhiteCat.png';  // Path to your sprite sheet

// Variables for the cat sprite (facing right)
const spriteX = 0;
const spriteY = 0;
const spriteWidth = 32;
const spriteHeight = 32;

// Variables for the cat's position and movement
let catX = 50;
let catY = canvas.height / 2;
let catWidth = 48;
let catHeight = 48;
let catVelocity = 0;
const gravity = 0.1;  // Reduced gravity for slower fall
const lift = -4;      // Less aggressive jump for better control
const maxVelocity = 2.5;  // Slower maximum velocity for smoother movement
let isStarted = false;
let isGameOver = false;

// Adjusted hitbox size
const hitboxOffsetX = 10;
const hitboxOffsetY = 8;
const hitboxWidth = catWidth - hitboxOffsetX * 2;
const hitboxHeight = catHeight - hitboxOffsetY * 2;

// Variables for the pipes
const pipeWidth = 60;
const pipeGap = 160;  // Increased gap for easier gameplay
let pipes = [];
const pipeSpeed = 2;
let pipeFrames = 0;  // Separate frame count for pipe generation

// Function to draw the cat facing the right direction
function drawCat() {
    ctx.save();
    ctx.translate(catX + catWidth / 2, catY + catHeight / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(
        catSpriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        -catWidth / 2,
        -catHeight / 2,
        catWidth,
        catHeight
    );
    ctx.restore();
}

// Function to create pipes
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap
    });
}

// Function to update pipes
function updatePipes() {
    pipeFrames++;
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);  // Remove off-screen pipes
        }
    }

    // Generate a new pipe every 150 frames for better spacing
    if (pipeFrames >= 150) {
        createPipe();
        pipeFrames = 0;  // Reset the pipe frame counter
    }
}

// Function to draw pipes
function drawPipes() {
    ctx.fillStyle = '#33cc33';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

// Function to check collisions
function checkCollisions() {
    if (catY + hitboxHeight > canvas.height || catY < 0) {
        isGameOver = true;
    }

    pipes.forEach(pipe => {
        if (
            catX + hitboxOffsetX + hitboxWidth > pipe.x &&
            catX + hitboxOffsetX < pipe.x + pipeWidth &&
            (catY + hitboxOffsetY < pipe.top || catY + hitboxOffsetY + hitboxHeight > pipe.bottom)
        ) {
            isGameOver = true;
        }
    });
}

// Function to reset the game
function resetGame() {
    catY = canvas.height / 2;
    catVelocity = 0;  // Reset velocity properly
    pipes = [];
    isGameOver = false;
    isStarted = false;
    pipeFrames = 0;  // Reset pipe generation frames

    // Restart the game loop
    requestAnimationFrame(gameLoop);
}

// Function to update the cat's position
function updateCat() {
    if (!isStarted || isGameOver) return;

    // Delay gravity slightly after the game starts
    if (catVelocity === 0) {
        catVelocity = 0.1;  // Small initial velocity to prevent sudden fall
    }

    catVelocity += gravity;
    catVelocity = Math.min(catVelocity, maxVelocity);  // Cap the velocity
    catY += catVelocity;
    checkCollisions();
}

// Game loop function
let frames = 0;
function gameLoop() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        ctx.font = '40px Poppins';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    if (isStarted && !isGameOver) {
        updatePipes();
        drawPipes();
    }

    updateCat();
    drawCat();

    requestAnimationFrame(gameLoop);
}

// Start the game when spacebar is pressed
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        if (!isStarted || isGameOver) {
            if (isGameOver) {
                resetGame();  // Reset if game over
            }
            isStarted = true;
        }
        catVelocity = lift;  // Make the cat jump
    }
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', function() {
    resetGame();  // Call resetGame to reset the game
});

// Load the sprite sheet and start the game loop once it's loaded
catSpriteSheet.onload = function() {
    requestAnimationFrame(gameLoop);
};
