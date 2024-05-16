// script.js

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => {                                                                                         
            return board[index] === player;
        });
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function handleClick(event) {
    const index = event.target.dataset.index;
    if (board[index] !== '' || currentPlayer !== 'X') return;
    board[index] = currentPlayer;
    updateBoard();
    if (checkWin(currentPlayer)) {
        message.textContent = `${currentPlayer} ha ganado!`;
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
    } else if (checkDraw()) {
        message.textContent = 'Empate!';
    } else {
        currentPlayer = 'O';
        makeComputerMove();
    }
}

async function makeComputerMove() {
    const model = await tf.loadLayersModel('model/ttt_model.json');
    const tensorBoard = tf.tensor(board.map(cell => cell === 'X' ? 1 : cell === 'O' ? -1 : 0), [1, 9]);
    const prediction = model.predict(tensorBoard);
    const predictedIndex = prediction.argMax(1).dataSync()[0];
    board[predictedIndex] = 'O';
    updateBoard();
    if (checkWin('O')) {
        message.textContent = 'O ha ganado!';
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
    } else if (checkDraw()) {
        message.textContent = 'Empate!';
    } else {
        currentPlayer = 'X';
    }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));

resetButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    message.textContent = '';
    updateBoard();
    cells.forEach(cell => cell.addEventListener('click', handleClick));
});
