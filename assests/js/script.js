var currentDirection = "right";
var foodPos = [12, 16];
var snakeArr = [
    [2, 3],
    [2, 2],
]
var speed = 10;
var moveSnakeInterval;
var score = 0;

const moveSnake = () => {
    if (hasCollidedWithBorder() || hasBittenHimSelf()) {
        gameOver();
        return;
    }
    if (hasCollectedFood()) {
        score += 1;
        document.getElementById("score").innerText = score;
        increaseSnackLength();
        generateFood();
    }
    switch (currentDirection) {
        case "left":
            newHeadPos = [snakeArr[0][0], snakeArr[0][1] - 1];
            break;
        case "right":
            newHeadPos = [snakeArr[0][0], snakeArr[0][1] + 1];
            break;
        case "up":
            newHeadPos = [snakeArr[0][0] - 1, snakeArr[0][1]];
            break;
        case "down":
            newHeadPos = [snakeArr[0][0] + 1, snakeArr[0][1]];
            break;
    }
    for (let i = snakeArr.length - 1; i >= 1; i--) {
        snakeArr[i] = snakeArr[i - 1];
    }
    snakeArr[0] = newHeadPos;
    displaySnake();
}

const startGame = () => {
    score = 0;
    document.getElementById("score").innerText = 0;
    let difficulty = document.getElementById("difficulty");
    speed = difficulty.value;
    difficulty.setAttribute("disabled", "true");
    startBtn.setAttribute("disabled", "true");
    resetPlayGround();
    displaySnake();
    generateFood();
    displayFood();
    moveSnakeInterval = setInterval(moveSnake, (1000 / speed));
    document.onkeydown = snakeMovementListener;
}

const resetPlayGround = () => {
    foodPos = [12, 16];
    snakeArr = [
        [2, 3],
        [2, 2],
    ]
    currentDirection = "right";
}

const displayFood = () => {
    document.querySelectorAll(".food").forEach(f => f.remove());
    let foodElement = document.createElement("div");
    foodElement.innerHTML = ""
    foodElement.style.gridRowStart = foodPos[0];
    foodElement.style.gridColumnStart = foodPos[1];
    foodElement.classList.add("food");

    document.getElementById("gameBoard").append(foodElement);
}

const displaySnake = () => {
    document.querySelectorAll(".snake").forEach(s => s.remove());
    document.querySelectorAll(".snakeHead").forEach(s => s.remove());
    let snakeHead = document.createElement("div");
    snakeHead.innerHTML = ""
    snakeHead.style.gridRowStart = snakeArr[0][0];
    snakeHead.style.gridColumnStart = snakeArr[0][1];
    snakeHead.classList.add("snakeHead");

    gameBoard.append(snakeHead);

    snakeArr.forEach((snakePos, index) => {
        if (index > 0) {
            let snakeElement = document.createElement("div");
            snakeElement.innerHTML = ""
            snakeElement.style.gridRowStart = snakePos[0];
            snakeElement.style.gridColumnStart = snakePos[1];
            snakeElement.classList.add("snake");

            gameBoard.append(snakeElement);
        }
    })
}

const generateFood = () => {
    foodPos[0] = Math.floor(Math.random() * 18) + 2;
    foodPos[1] = Math.floor(Math.random() * 18) + 2;
    displayFood();
}

const increaseSnackLength = () => {
    switch (currentDirection) {
        case "left":
            newHeadPos = [snakeArr[0][0], snakeArr[0][1] - 1];
            break;
        case "right":
            newHeadPos = [snakeArr[0][0], snakeArr[0][1] + 1];
            break;
        case "up":
            newHeadPos = [snakeArr[0][0] - 1, snakeArr[0][1]];
            break;
        case "down":
            newHeadPos = [snakeArr[0][0] + 1, snakeArr[0][1]];
            break;
    }
    snakeArr.unshift(newHeadPos);
}

const changeDirection = (direction) => {
    currentDirection = direction;
}

const snakeMovementListener = (e) => {
    switch (e.keyCode) {
        case 37:
            //Left            
            if (currentDirection == "right" || currentDirection == "left") break;
            changeDirection("left")
            break;
        case 38:
            //Up
            if (currentDirection == "down" || currentDirection == "up") break;
            changeDirection("up")
            break;
        case 39:
            //Right
            if (currentDirection == "right" || currentDirection == "left") break;
            changeDirection("right")
            break;
        case 40:
            // Down
            if (currentDirection == "down" || currentDirection == "up") break;
            changeDirection("down")
            break;
    }
}

const hasCollectedFood = () => snakeArr[0][0] == foodPos[0] && snakeArr[0][1] == foodPos[1];

const hasCollidedWithBorder = () =>
    snakeArr[0][0] == 0 || snakeArr[0][0] == 20 ||
    snakeArr[0][1] == 0 || snakeArr[0][1] == 20 ||
    snakeArr[1][0] == 0 || snakeArr[1][0] == 20 ||
    snakeArr[1][1] == 0 || snakeArr[1][1] == 20;

const hasBittenHimSelf = () => {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i][0] == snakeArr[0][0] && snakeArr[i][1] == snakeArr[0][1])
            return true;
    }
    return false;
}

const gameOver = () => {
    $('#gameOverModal').modal('show')
    let prevHighestScore = localStorage.getItem("highestScore");
    if (!prevHighestScore || prevHighestScore < score) {
        localStorage.setItem("highestScore", score);
        $("#highScoreModal").modal('show');
        document.getElementById("highscore").innerHTML = score;
    }
    clearInterval(moveSnakeInterval);
    startBtn.innerText = "New Game";
    startBtn.removeAttribute("disabled");
    document.getElementById("difficulty").removeAttribute("disabled");
}

var startBtn = document.getElementById("startBtn")
startBtn.onclick = startGame;

window.onload = () => {
    document.getElementById("highscore").innerHTML = localStorage.getItem("highestScore") || 0;
    displaySnake();
}
