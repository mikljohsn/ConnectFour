"use strict";

window.addEventListener("load", start);

document.querySelector("#reset-btn").addEventListener("click", resetGame);

const GRID_WIDTH = 7;
const GRID_HEIGHT = 6;
const ROWS = null;
const COLS = null;

// ***************** CONTROLLER *****************

// ***************** VIEW *****************

function start() {
  console.log("JS is running");
  createView();
  makeBoardClickable();
  createModel();
}

function createView() {
  const board = document.querySelector("#board");

  board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

function makeBoardClickable() {
  const board = document.querySelector("#board");
  board.removeEventListener("click", boardClicked);
  board.addEventListener("click", boardClicked);
}

function makeBoardUnclickable() {
  document.querySelector("#board").removeEventListener("click", boardClicked);
}

function boardClicked(event) {
  console.log("board clicked");
  const cell = event.target;

  if (cell.classList.contains("cell")) {
    console.log(cell);

    const row = cell.dataset.row;
    const col = cell.dataset.col;
    console.log(`clicked on row:  ${row} and col: ${col} `);
    selectCell(row, col);
  }
}
function displayBoard() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const value = readFromCell(row, col);
      console.log("value: ", value);
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      switch (value) {
        case 1:
          cell.classList.add("red");
          break;
        case 2:
          cell.classList.add("yellow");
          break;
      }
    }
  }
}
function clearBoardVisuals() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("red", "yellow");
  });
}

// ***************** MODEL *****************

const model = [];
const playerRed = 1;
const playerYellow = 2;
let currentPlayer = 1;
let currentColumns = [5, 5, 5, 5, 5, 5, 5];

function createModel() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      newRow[col] = 0;
    }
    model[row] = newRow;
  }
}

function selectCell(row, col) {
  row = currentColumns[col];
  if (row < 0) return;
  currentColumns[col] = row - 1;
  if (readFromCell(row, col) === 0) {
    writeToCell(row, col, currentPlayer);
    displayBoard();

    if (checkwinner()) {
      makeBoardUnclickable();
      const winnerName = currentPlayer === 1 ? "Red" : "Yellow";
      document.getElementById("winner").textContent = winnerName + " wins!";
      return;
    }

    switchPlayer();
  }
}

function switchPlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
}

function writeToCell(row, col, value) {
  model[row][col] = value;
}

function readFromCell(row, col) {
  return model[row][col];
}

function checkwinner() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (readFromCell(row, col) === currentPlayer) {
        if (
          checkHorizontal(row, col) ||
          checkVertical(row, col) ||
          checkDiagonal(row, col) ||
          checkAntiDiagonal(row, col)
        ) {
          console.log("winner");
          return true;
        }
      }
    }
  }
  return false;
}

function checkHorizontal(row, col) {
  if (col > GRID_WIDTH - 4) return false;
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (readFromCell(row, col + i) === currentPlayer) {
      count++;
    }
  }
  return count === 4;
}

function checkVertical(row, col) {
  if (row > GRID_HEIGHT - 4) return false; 
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (readFromCell(row + i, col) === currentPlayer) {
      count++;
    }
  }
  return count === 4;
}

function checkDiagonal(row, col) {
  if (row > GRID_HEIGHT - 4 || col > GRID_WIDTH - 4) return false;
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (readFromCell(row + i, col + i) === currentPlayer) {
      count++;
    }
  }
  return count === 4;
}
function checkAntiDiagonal(row, col) {
  if (col < 3 || row > GRID_HEIGHT - 4) return false;

  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (readFromCell(row + i, col - i) === currentPlayer) {
      count++;
    }
  }
  return count === 4;
}

function resetGame() {
  console.log("reset game");
  clearBoardVisuals();
  createModel();
  currentColumns = [5, 5, 5, 5, 5, 5, 5];
  currentPlayer = 1;
  makeBoardClickable();
  document.getElementById("winner").textContent = "";
}
