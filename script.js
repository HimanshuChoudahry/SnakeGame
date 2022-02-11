let direction = { x: 0, y: 0 };
let lastDirection = { x: 0, y: 0 };
let speed = 6;
let lastTime = 0;
const GRID_SIZE = 21;
let snake = [{ x: 11, y: 11 }];
let food = getRandomPosition();
let gameOver = false;
let res = 0;
let highScoreVal;
let high = localStorage.getItem("high");




//game function
function main(currTime) {

    if (gameOver) {
        if (confirm('Game Over! Press ok to try again.')) {
            window.location = '/'
        }
        return;
    }
    window.requestAnimationFrame(main);
    if ((currTime - lastTime) / 1000 < 1 / speed) return;
    lastTime = currTime;

    gameEngine();
}


function gameEngine() {
    scoreBox.innerHTML = "Score : " + res;
    //moving the snake
    for (let i = snake.length - 2; i >= 0; i--) {
        snake[i + 1] = { ...snake[i] };
    }

    snake[0].x += direction.x;
    snake[0].y += direction.y;

    //eating food
    if (snake[0].x === food.x && snake[0].y === food.y) {

        res += 1;

        if (res > highScoreVal) {
            highScoreVal = res;
            highScore.innerHTML = "HighScore : " + highScoreVal;
            localStorage.setItem("high", JSON.stringify(highScoreVal));

        }
        snake.unshift({ x: snake[0].x + direction.x, y: snake[0].y + direction.y });
        food = getRandomPosition();
    }

    //Game Over
    gameOver = outsideGrid(snake[0]) || snakeIntersection();


    //draw
    board.innerHTML = "";

    //snake
    snake.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) snakeElement.classList.add('head');
        else
            snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    })

    //food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//Game Over Functions
function outsideGrid(position) {
    return (
        position.x <= 0 || position.x > GRID_SIZE || position.y <= 0 || position.y > GRID_SIZE
    )
}

function snakeIntersection() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

//Getting Random Positions for food not on the snake's body
function getRandomPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}

function randomGridPosition() {
    return { x: Math.floor(GRID_SIZE * Math.random()) + 1, y: Math.floor(GRID_SIZE * Math.random()) + 1 };
}

//Checking whether position is on the snake or not
function onSnake(position) {
    return snake.some((element) => {
        return comparePositions(position, element);
    })
}

function comparePositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

//main
if (high === null) {
    highScoreVal = 0;
    localStorage.setItem("high", JSON.stringify(highScoreVal));
    highScore.innerHTML = "HighScore : " + highScoreVal;
} else {
    highScoreVal = JSON.parse(high);
    highScore.innerHTML = "HighScore : " + highScoreVal;
}
window.requestAnimationFrame(main);

//input
window.addEventListener('keydown', (e) => {

    switch (e.key) {
        case "ArrowUp":
            if (lastDirection.y !== 0) break;
            direction.x = 0;
            direction.y = -1;
            lastDirection = direction;
            break;
        case "ArrowDown":
            if (lastDirection.y !== 0) break;
            direction.x = 0;
            direction.y = 1;
            lastDirection = direction;
            break;
        case "ArrowLeft":
            if (lastDirection.x !== 0) break;
            direction.x = -1;
            direction.y = 0;
            lastDirection = direction;
            break;
        case "ArrowRight":
            if (lastDirection.x !== 0) break;
            direction.x = 1;
            direction.y = 0;
            lastDirection = direction;
            break;
        default:
            break;
    }
})