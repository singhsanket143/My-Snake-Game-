document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0; // Score of the game
    let gameStarted = false; // Game status
    let food = { x: 300, y: 200 }; // {x: 15*20, y: 10*20} // -> cell coordinate -> pixels// top left pixels for food
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}]; // [head, body, body, tail]

    let dx = cellSize; // +20
    let dy = 0;

    let intervalId = null;

    function endGame(){
        clearInterval(intervalId);
        intervalId = null;
        gameStarted = false;
    }

    function generateRandomLocation(){
        let x_cor = Math.floor(Math.random()*30)*20;
        let y_cor = Math.floor(Math.random()*30)*20;
        return {x: x_cor, y: y_cor};
    }
    function updateFoodLocation(){
        let newLocation = generateRandomLocation();
        while(snake.includes(newLocation)){
            newLocation = generateRandomLocation();
        }
        food = newLocation;
    }

    function searchInSnake(position){
        for(let i=0; i<snake.length; i++){
            if(snake[i].x===position.x && snake[i].y===position.y) return true;
        }
        return false;
    }

    function updateSnake() {
        let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // check collision with food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            // TODO: move food
            updateFoodLocation();
            snake.unshift(newHead); // Add new head to the snake
        }
        //check collision with snake-itself or collision with boundry 
        else if(searchInSnake(newHead) || newHead.x<0 || newHead.x>=600 || newHead.y<0 || newHead.y>=600){
            //end the Game
            endGame();
        }
        
        else {
            snake.pop(); // Remove tail
            snake.unshift(newHead); // Add new head to the snake
        }
        
    }

    function changeDirection(e) {
        console.log("key pressed", e);
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key === 'ArrowUp' && !isGoingDown ) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // Clear the game arena
        // wipe out everything and redraw with new positions

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }
    function updateScoreBoard(){
        scoreBoard = document.getElementById('score-board')
        scoreBoard.innerHTML=`Score : ${score}`;
    }
    function gameLoop() {
        intervalId = setInterval(() => {
            updateSnake();
            drawFoodAndSnake();
            updateScoreBoard();
        }, 150);
    }

    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            
            gameLoop(); // TODO: Implement game loop
        }
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div'); 
        scoreBoard.id = 'score-board';

        document.body.insertBefore(scoreBoard, gameArena); // Insert score board before game arena


        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame() {
            startButton.style.display = 'none'; // Hide start button

            runGame();
        });

        document.body.appendChild(startButton); // Append start button to the body
    }

    initiateGame();
    
});
