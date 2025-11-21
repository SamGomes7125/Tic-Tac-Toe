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
      const [a,b,c] = combo;
      if (
        board[a] !== "" &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return board[a]; // return "X" or "O"
      }
    }

    if (!board.includes("")) {
      return "draw";
    }

    return null;
  };

  const playRound = (index) => {
    if (gameOver) return;

    const success = Gameboard.setCell(index, currentPlayer.marker);
    if (!success) return; // prevent overriding cells

    const result = checkWinner();

    if (result === "X" || result === "O") {
      DisplayController.showMessage(`${currentPlayer.name} wins!`);
      gameOver = true;
    } else if (result === "draw") {
      DisplayController.showMessage("It's a draw!");
      gameOver = true;
    } else {
      switchPlayer();
      DisplayController.showMessage(`${currentPlayer.name}'s turn`);
    }

    DisplayController.updateBoard();
  };

  const restartGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    DisplayController.updateBoard();
    DisplayController.showMessage("Player X's turn");
  };

  return { playRound, restartGame };
})();

// -----------------------------
// Display Controller Module
// -----------------------------
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.createElement("div");
  message.style.marginTop = "20px";
  document.body.appendChild(message);

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;
      GameController.playRound(index);
    });
  });

  const updateBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const showMessage = (msg) => {
    message.textContent = msg;
  };

  document.querySelector("#restart-btn").addEventListener("click", () => {
    GameController.restartGame();
  });

  // initialize
  showMessage("Player X's turn");

  return { updateBoard, showMessage };
})();

