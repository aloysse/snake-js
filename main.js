import "./style.css";

const gameBoard = document.querySelector("#gameBoard");
const scoreDOM = document.querySelector("#score");

const BOARD_SIZE = 300;
const CELL_SIZE = 10;
const numCells = BOARD_SIZE / CELL_SIZE;
const mainColor = "white";
let food = null;
let score = 0;
let speed = 100;

gameBoard.style.width = BOARD_SIZE + "px";
gameBoard.style.height = BOARD_SIZE + "px";

let board = [];
for (let i = 0; i < numCells; i++) {
  board[i] = [];
  for (let j = 0; j < numCells; j++) {
    board[i][j] = null;
  }
}

const snakeLength = 3;
let snake = {
  body: [],
  direction: "right",
  getTailCell() {
    return this.body[0].element;
  },
};

function snakeInitial() {
  snake.body = [];
  snake.direction = "right";
  score = 0;
  speed = 100;

  gameBoard.innerHTML = "";
  scoreDOM.innerHTML = score;

  for (let i = 0; i < numCells; i++) {
    board[i] = [];
    for (let j = 0; j < numCells; j++) {
      board[i][j] = null;
    }
  }

  createFood();

  // 放置snake
  for (let i = 0; i < snakeLength; i++) {
    snake.body.push({ x: i, y: 0 });
    let snakeCell = drawCells(snake.body[i].x, snake.body[i].y);
    gameBoard.appendChild(snakeCell);
    snake.body[i].element = snakeCell;
    // console.log(snake.body[i]);
  }
}

function drawCells(x, y, index) {
  let cell = document.createElement("div");
  cell.style.width = CELL_SIZE + "px";
  cell.style.height = CELL_SIZE + "px";
  cell.style.background = mainColor;
  cell.style.position = "absolute";
  cell.style.boxSizing = "border-box";
  cell.style.border = "black 1px solid";
  cell.style.top = y * CELL_SIZE + "px";
  cell.style.left = x * CELL_SIZE + "px";
  return cell;
}

// 更新蛇的位置
function updateSnake() {
  // 取得頭部位置
  let head = snake.body[snake.body.length - 1];
  let newHead = {};

  // 根據方向移動頭部位置
  switch (snake.direction) {
    case "right":
      newHead = { x: head.x + 1, y: head.y };
      break;
    case "left":
      newHead = { x: head.x - 1, y: head.y };
      break;
    case "up":
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case "down":
      newHead = { x: head.x, y: head.y + 1 };
      break;
  }

  // 檢查新頭位置，是否繼續
  if (
    newHead.x < 0 ||
    newHead.x >= numCells ||
    newHead.y < 0 ||
    newHead.y >= numCells
  ) {
    // 新頭在board之外，遊戲結束
    gameOver();
  } else if (board[newHead.x][newHead.y] !== null) {
    // 新頭位置有其他物件，遊戲結束
    gameOver();
  } else if (newHead.x === food.x && newHead.y === food.y) {
    let newHeadCell = drawCells(newHead.x, newHead.y);
    gameBoard.appendChild(newHeadCell);

    // 更新身體部分
    snake.body.push({ x: newHead.x, y: newHead.y, element: newHeadCell });
    // 更新遊戲版上的物體內容
    board[newHead.x][newHead.y] = snake.body[snake.body.length - 1].element;

    food = null;
  } else {
    let newHeadCell = drawCells(newHead.x, newHead.y);
    let tailCell = snake.getTailCell(); //TODO 等待修改
    // console.log(tailCell);
    gameBoard.appendChild(newHeadCell);
    gameBoard.removeChild(tailCell);

    // 更新身體部分
    snake.body.push({ x: newHead.x, y: newHead.y, element: newHeadCell });
    let tail = snake.body.shift();
    board[tail.x][tail.y] = null;

    // 更新遊戲版上的物體內容
    board[newHead.x][newHead.y] = snake.body[snake.body.length - 1].element;
  }

  updateFood();
  setTimeout(updateSnake, speed);
}

function updateFood() {
  // 檢查是否需要創建新食物
  if (food === null) {
    createFood();
    score++;
    scoreDOM.innerHTML = score;
    if (score !== 0 && score % 5 === 0) {
      speed = speed * (8 / 10);
    }
  }
}

function createFood() {
  let newFood = null;
  while (newFood === null || onSnake(newFood)) {
    newFood = {
      x: Math.floor(Math.random() * (numCells - 1)) + 1,
      y: Math.floor(Math.random() * (numCells - 1)) + 1,
    };
  }

  const oldFood = document.getElementById("food");
  if (oldFood) {
    oldFood.parentNode.removeChild(oldFood);
  }

  food = newFood;

  const foodElement = drawCells(food.x, food.y);
  foodElement.id = "food";
  gameBoard.appendChild(foodElement);
}

function onSnake(position, { ignoreHead = false } = {}) {
  return snake.body.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPositions(segment, position);
  });
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

snakeInitial();
updateSnake();

function gameOver() {
  console.log(board);
  alert("game over");

  // score = 0;
  snakeInitial();
  // updateSnake();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight" && snake.direction !== "left") {
    snake.direction = "right";
  } else if (event.key === "ArrowLeft" && snake.direction !== "right") {
    snake.direction = "left";
  } else if (event.key === "ArrowUp" && snake.direction !== "down") {
    snake.direction = "up";
  } else if (event.key === "ArrowDown" && snake.direction !== "up") {
    snake.direction = "down";
  }
});

// console.log(board);
