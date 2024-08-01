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

    // Make AI move if it's AI mode and it's AI's turn (AI plays as O)
    if (gameActive && isAIMode && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
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
        status.textContent = `${currentPlayer} wins! Refresh/toggle to clear board.`;
        gameActive = false;
        return;
    }

    // If draw (zero empty cells left but no winner), display and terminate game
    if (!gameBoard.includes('')) {
        status.textContent = "It's a draw! Refresh/toggle clear board.";
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

// Make AI move
function makeAIMove() {
    const bestMove = minimax(gameBoard, 'O', -Infinity, Infinity, 0).index;
    const cell = cells[bestMove];
    updateCell(cell, bestMove);
    checkResult();
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, player, alpha, beta, depth) {
    // Check for terminal states first
    // By introducing depth to the terminal state values, quicker wins score
    // higher, and quicker losses score lower
    // This fixes subtle bugs where the AI prioritizes blocking the opponent's
    // line over completing its own
    if (checkWinner(board, 'O')) {
        return { score: 10 - depth };
    } else if (checkWinner(board, 'X')) {
        return { score: depth - 10 };
    } else if (getEmptyCells(board).length === 0) {
        return { score: 0 };
    }

    const availableMoves = getEmptyCells(board);
    let bestMove = {};

    if (player === 'O') {
        // Maximizing player
        bestMove.score = -Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            board[move] = player;
            const result = minimax(board, 'X', alpha, beta, depth + 1);
            board[move] = '';

            if (result.score > bestMove.score) {
                bestMove.score = result.score;
                bestMove.index = move;
            }

            alpha = Math.max(alpha, bestMove.score);
            if (beta <= alpha) {
                break;
            }
        }
    } else {
        // Minimizing player
        bestMove.score = Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            board[move] = player;
            const result = minimax(board, 'O', alpha, beta, depth + 1);
            board[move] = '';

            if (result.score < bestMove.score) {
                bestMove.score = result.score;
                bestMove.index = move;
            }

            beta = Math.min(beta, bestMove.score);
            if (beta <= alpha) {
                break;
            }
        }
    }

    return bestMove;
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