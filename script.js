// Get canvas and context
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [
    { x: 10, y: 10 }
];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameSpeed = 100; // milliseconds

// Get DOM elements
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', changeDirection);

// Draw functions
function drawGame() {
    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    
    // Check collisions
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // Check if snake eats food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        growSnake();
        generateFood();
        
        // Increase speed slightly with each food eaten
        if (gameSpeed > 50) {
            gameSpeed -= 2;
        }
    }
    
    if (gameRunning) {
        setTimeout(drawGame, gameSpeed);
    }
}

function clearCanvas() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    
    // Draw each segment of the snake
    snake.forEach((segment, index) => {
        // Make the head a different color
        if (index === 0) {
            ctx.fillStyle = '#45a049';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Game logic functions
function moveSnake() {
    // Create new head based on direction
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Add new head to beginning of snake array
    snake.unshift(head);
    
    // Remove tail unless the snake just ate food (handled in the eat food logic)
    if (!(head.x === food.x && head.y === food.y)) {
        snake.pop();
    }
}

function growSnake() {
    // The snake grows automatically because we don't remove the tail in moveSnake
    // when the snake eats food
}

function generateFood() {
    // Generate random position for food
    let newFoodX, newFoodY;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFoodX = Math.floor(Math.random() * tileCount);
        newFoodY = Math.floor(Math.random() * tileCount);
        
        // Check if the food is on the snake
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = { x: newFoodX, y: newFoodY };
}

function changeDirection(event) {
    // Prevent reverse direction
    if (!gameRunning) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = event.keyCode;
    
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingLeft = dx === -1;
    const goingRight = dx === 1;
    
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Check self collision (start from 1 as 0 is the head itself)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        // Start with right direction
        dx = 1;
        dy = 0;
        drawGame();
    }
}

function restartGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = score;
    gameRunning = false;
    
    // Clear canvas and draw initial state
    clearCanvas();
    drawSnake();
    drawFood();
}

// Initialize game
restartGame();