// Get DOM elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const modeToggle = document.getElementById('mode-toggle');
const modeText = document.getElementById('mode-text');

// Initialize game state
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isAIMode = false; // Human vs Human by default

// Hard-coded winning combos
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Cell click handler
function handleCellClick(e) {
    const cellIndex = e.target.getAttribute('data-index');

    // Do nothing if illegal move (cell occupied or game over)
    if (gameBoard[cellIndex] !== '' || !gameActive) return;

    // If legal move, update cell and advance game
    updateCell(e.target, cellIndex);
    checkResult();
}

// Update cell (for both human and AI moves)
function updateCell(cell, idx) {
    gameBoard[idx] = currentPlayer;
    cell.textContent = currentPlayer;
}

// Switch players after every move
function changePlayer() {
    // If current player is 'O', set to 'X', and vice versa
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Update status
    status.textContent = `${currentPlayer}'s turn`;
}

// Check if a player has won
function checkWinner(board, player) {
    // Iterate through winning combos
    for (let i = 0; i < winningCombos.length; i++) {
        // Check if player occupies each cell in a particular winning combo
        const [a, b, c] = winningCombos[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Check result after each move
function checkResult() {
    // If there is a winner, display and terminate game
    let roundWon = checkWinner(gameBoard, currentPlayer);
    if (roundWon) {
        status.textContent = `${currentPlayer} wins! Refresh/toggle to play again.`;
        gameActive = false;
        return;
    }

    // If draw (zero empty cells left but no winner), display and terminate game
    if (!gameBoard.includes('')) {
        status.textContent = "It's a draw! Refresh/toggle to play again.";
        gameActive = false;
        return;
    }

    // Switch players if the game is not over
    changePlayer();
}

// Reset game 
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = "X's turn";
    cells.forEach(cell => cell.textContent = '');
}

// Return all empty cells
function getEmptyCells(board) {
    return board.reduce((acc, cell, idx) => {
        if (cell === '') acc.push(idx);
        return acc;
    }, []);
}

// Toggle listener
// Resets game and switches between modes
modeToggle.addEventListener('change', () => {
    isAIMode = modeToggle.checked;
    resetGame();
});

// Cell click listener
board.addEventListener('click', handleCellClick);

// Initialize game
resetGame();