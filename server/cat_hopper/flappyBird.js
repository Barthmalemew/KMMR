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
let catWidth = 48;  // Make the cat smaller (previously 64)
let catHeight = 48; // Make the cat smaller (previously 64)
let catVelocity = 0;
const gravity = 0.3;
const lift = -8;
const maxVelocity = 5;
let isStarted = false;  // Flag for whether the game has started
let isGameOver = false; // Flag for whether the game is over

// Adjusted hitbox size
const hitboxOffsetX = 10;  // Adjusted hitbox from sides
const hitboxOffsetY = 8;   // Adjusted hitbox from top/bottom
const hitboxWidth = catWidth - hitboxOffsetX * 2;  // Reduce hitbox width
const hitboxHeight = catHeight - hitboxOffsetY * 2; // Reduce hitbox height

// Variables for the pipes
const pipeWidth = 60;
const pipeGap = 150;
let pipes = [];
const pipeSpeed = 2;

// Function to draw the cat facing the right direction
function drawCat() {
    // Save the context state
    ctx.save();

    // Move the origin to the position of the cat
    ctx.translate(catX + catWidth / 2, catY + catHeight / 2);

    // Flip the sprite horizontally (to face right)
    ctx.scale(-1, 1);  // This flips the image horizontally

    // Draw the cat sprite, adjusting for the flipped origin
    ctx.drawImage(
        catSpriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        -catWidth / 2,  // Adjust the draw position to account for translate
        -catHeight / 2, // Adjust the draw position to account for translate
        catWidth,
        catHeight
    );

    // Restore the context state to prevent global scaling
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
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Remove pipes that go off-screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    // Add a new pipe every 100 frames
    if (frames % 100 === 0) {
        createPipe();
    }
}

// Function to draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        // Draw top pipe
        ctx.fillStyle = '#33cc33';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

        // Draw bottom pipe
        ctx.fillStyle = '#33cc33';
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

// Function to check collisions with the smaller hitbox
function checkCollisions() {
    // Check if the cat hits the ground or flies too high
    if (catY + hitboxHeight > canvas.height || catY < 0) {
        isGameOver = true;
    }

    // Check for pipe collisions
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
    catVelocity = 0;
    pipes = [];
    isGameOver = false;
    isStarted = false;
}

// Function to update the cat's position
function updateCat() {
    if (!isStarted || isGameOver) return; // Only update the cat if the game has started and isn't over
    catVelocity += gravity;
    catVelocity = Math.min(catVelocity, maxVelocity); // Cap the velocity
    catY += catVelocity;

    // Check for collisions
    checkCollisions();
}

// Game loop function
let frames = 0;
function gameLoop() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw pipes
    if (isStarted && !isGameOver) {
        updatePipes();
        drawPipes();
    }

    // Update and draw the cat
    updateCat();
    drawCat();

    // Check if the game is over
    if (isGameOver) {
        ctx.font = '40px Poppins';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop); // Continue the game loop
}

// Start the game when spacebar is pressed
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        if (!isStarted) {
            isStarted = true;  // Start the game on the first spacebar press
        }
        if (isGameOver) {
            resetGame(); // Reset the game if it's over and spacebar is pressed
        }
        catVelocity = lift;  // Make the cat jump
    }
});

// Load the sprite sheet and start the game loop once it's loaded
catSpriteSheet.onload = function() {
    requestAnimationFrame(gameLoop); // Start the game loop
};
