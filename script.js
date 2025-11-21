// -----------------------------
// Gameboard Module
// -----------------------------
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
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
  let player1, player2;
  let currentPlayer;
  let gameOver = true;

  const startGame = (p1Name, p2Name) => {
    player1 = Player(p1Name || "Player X", "X");
    player2 = Player(p2Name || "Player O", "O");
    currentPlayer = player1;
    gameOver = false;

    Gameboard.resetBoard();
    DisplayController.updateBoard();
    DisplayController.showStatus(`${currentPlayer.name}'s turn`);
  };

  const switchPlayer = () =>
    (currentPlayer = currentPlayer === player1 ? player2 : player1);

  const checkWinner = () => {
    const b = Gameboard.getBoard();
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let combo of wins) {
      const [a, b1, c] = combo;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }

    if (!b.includes("")) return "draw";
    return null;
  };

  const playRound = (index) => {
    if (gameOver) return;

    if (!Gameboard.setCell(index, currentPlayer.marker)) return;

    const result = checkWinner();

    if (result === "X" || result === "O") {
      DisplayController.showStatus(`${currentPlayer.name} wins!`);
      gameOver = true;
      DisplayController.enableRestart();
    } else if (result === "draw") {
      DisplayController.showStatus("It's a draw!");
      gameOver = true;
      DisplayController.enableRestart();
    } else {
      switchPlayer();
      DisplayController.showStatus(`${currentPlayer.name}'s turn`);
    }

    DisplayController.updateBoard();
  };

  const restartGame = () => {
    gameOver = true;
    DisplayController.disableBoard();
    DisplayController.showStatus("Enter names and start a new game.");
  };

  return { playRound, startGame, restartGame };
})();

// -----------------------------
// Display Controller Module
// -----------------------------
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector("#status-text");
  const startBtn = document.querySelector("#start-btn");
  const restartBtn = document.querySelector("#restart-btn");
  const boardElement = document.querySelector("#game-board");

  // Clicking a cell
  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      GameController.playRound(cell.dataset.index);
    });
  });

  const updateBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const showStatus = (msg) => {
    statusText.textContent = msg;
  };

  const enableBoard = () => boardElement.classList.remove("disabled");
  const disableBoard = () => boardElement.classList.add("disabled");

  const enableRestart = () => restartBtn.classList.remove("hidden");

  // Start button
  startBtn.addEventListener("click", () => {
    const p1 = document.querySelector("#player1-name").value.trim();
    const p2 = document.querySelector("#player2-name").value.trim();

    enableBoard();
    restartBtn.classList.remove("hidden");

    GameController.startGame(p1, p2);
  });

  // Restart button
  restartBtn.addEventListener("click", () => {
    GameController.startGame(
      document.querySelector("#player1-name").value.trim(),
      document.querySelector("#player2-name").value.trim()
    );
  });

  return { updateBoard, showStatus, enableRestart, disableBoard };
})();
