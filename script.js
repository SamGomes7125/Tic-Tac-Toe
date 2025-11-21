// -----------------------------
// Gameboard Module
// -----------------------------
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    index = Number(index);
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, resetBoard };
})();

// -----------------------------
// Player Factory
// -----------------------------
const Player = (name, marker) => {
  return { name, marker };
};

// -----------------------------
// Game Controller Module
// -----------------------------
const GameController = (() => {
  const player1 = Player("Player X", "X");
  const player2 = Player("Player O", "O");
  let currentPlayer = player1;
  let gameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    for (let combo of winConditions) {
      const [a, b, c] = combo;
      if (
        board[a] !== "" &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return board[a];
