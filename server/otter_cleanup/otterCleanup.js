const rows = 10;
const cols = 10;
const otterCount = 15;
let otterBoard = [];
let revealedCells = 0;

function initGame() {
    console.log("Initializing game...");
    otterBoard = createBoard(rows, cols, otterCount);  // Now using the createBoard function
    console.log("Board created...");
    drawBoard();
    console.log("Board drawn...");
    document.getElementById('gameStatus').innerText = "Good luck!";
    revealedCells = 0;
}

function createBoard(rows, cols, otterCount) {
    let board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ otter: false, revealed: false, adjacent: 0 }))
    );
    let ottersPlaced = 0;
    let maxAttempts = rows * cols * 2;

    // Randomly place otters
    while (ottersPlaced < otterCount && maxAttempts > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        maxAttempts--;

        if (!board[r][c].otter) {
            board[r][c].otter = true;
            ottersPlaced++;

            // Increment the adjacent otter count for neighboring cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let newRow = r + i;
                    let newCol = c + j;
                    if (isInBounds(newRow, newCol, rows, cols) && !board[newRow][newCol].otter) {
                        board[newRow][newCol].adjacent++;
                    }
                }
            }
        }
    }

    if (ottersPlaced < otterCount) {
        console.error(`Failed to place all otters. Only placed ${ottersPlaced} out of ${otterCount}.`);
    }

    return board;
}

function isInBounds(row, col, rows, cols) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}


function drawBoard() {
    console.log("Drawing the game board...");
    const gameBoardDiv = document.getElementById('gameBoard');
    gameBoardDiv.innerHTML = '';  // Clear the board
    if (!gameBoardDiv) {
        console.error("Game board div not found!");
        return;
    }

    // Create a grid using a loop and append to the gameBoardDiv
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';  // Make sure CSS for 'cell' is working
            cellDiv.addEventListener('click', () => revealCell(row, col));
            gameBoardDiv.appendChild(cellDiv);
        }
    }

    console.log("Board drawing completed.");
}

function revealCell(row, col) {
    const cell = document.querySelector(`#gameBoard div:nth-child(${row * cols + col + 1})`);
    if (otterBoard[row][col].revealed) return;  // Do nothing if already revealed
    otterBoard[row][col].revealed = true;
    cell.classList.add('revealed');  // Add 'revealed' class to change style

    if (otterBoard[row][col].otter) {
        cell.textContent = 'O';  // Show otter
        cell.classList.add('otter');  // Add 'otter' class for styling
        document.getElementById('gameStatus').innerText = "Game Over! You hit an otter!";
        revealAllOtters();
    } else {
        if (otterBoard[row][col].adjacent === 0) {
            cell.textContent = '';  // No adjacent otters, leave cell blank
            floodFill(row, col);  // Reveal neighboring cells
        } else {
            cell.textContent = otterBoard[row][col].adjacent;  // Show number of adjacent otters
        }
    }
}


function floodFill(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (isInBounds(newRow, newCol, rows, cols) && !otterBoard[newRow][newCol].revealed && !otterBoard[newRow][newCol].otter) {
                revealCell(newRow, newCol);
            }
        }
    }
}



function revealAllOtters() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (otterBoard[row][col].otter) {
                const cell = document.querySelector(`#gameBoard div:nth-child(${row * cols + col + 1})`);
                cell.textContent = 'O';
            }
        }
    }
}

document.getElementById('resetButton').addEventListener('click', initGame);

window.onload = initGame;
