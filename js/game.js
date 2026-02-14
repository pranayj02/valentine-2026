// Game module - Snakes & Ladders implementation
window.GameModule = (function() {
    'use strict';
    
    let gameConfig, moments;
    let currentPosition = 0;
    let gameBoard, diceDisplay, rollButton, statusText;
    let isRolling = false;
    let gameFinished = false;
    
    function init(config, momentsData) {
        gameConfig = config;
        moments = momentsData;
        currentPosition = 0;
        gameFinished = false;
        
        render();
    }
    
    function render() {
        const container = document.getElementById('gameContainer');
        container.className = 'game-container';
        
        container.innerHTML = `
            <h2 class="game-title">Our Journey: The Game</h2>
            <div class="game-board" id="gameBoard"></div>
            <div class="game-controls">
                <div class="dice-display" id="diceDisplay">🎲</div>
                <button class="game-button" id="rollButton">Roll Dice</button>
                <div class="game-status" id="gameStatus">Roll to start your journey!</div>
            </div>
            <div id="momentCardContainer"></div>
        `;
        
        gameBoard = document.getElementById('gameBoard');
        diceDisplay = document.getElementById('diceDisplay');
        rollButton = document.getElementById('rollButton');
        statusText = document.getElementById('gameStatus');
        
        // Set grid columns based on board size
        const gridSize = Math.sqrt(gameConfig.boardSize);
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Create board squares
        createBoard();
        
        // Add event listener
        rollButton.addEventListener('click', rollDice);
    }
    
    function createBoard() {
        gameBoard.innerHTML = '';
        
        // Create squares in reverse order (snakes & ladders style)
        const gridSize = Math.sqrt(gameConfig.boardSize);
        let squareNumber = gameConfig.boardSize;
        
        for (let row = 0; row < gridSize; row++) {
            const isEvenRow = row % 2 === 0;
            const rowSquares = [];
            
            for (let col = 0; col < gridSize; col++) {
                rowSquares.push(squareNumber--);
            }
            
            // Reverse every other row for snake-like pattern
            if (!isEvenRow) {
                rowSquares.reverse();
            }
            
            rowSquares.forEach(num => {
                const square = createSquare(num);
                gameBoard.appendChild(square);
            });
        }
        
        // Place initial token
        updateTokenPosition();
    }
    
    function createSquare(number) {
        const square = document.createElement('div');
        square.className = 'game-square';
        square.setAttribute('data-square', number);
        
        // Check if this square has a moment
        const momentSquare = gameConfig.squareMoments.find(m => m.square === number);
        if (momentSquare) {
            square.classList.add('has-moment');
            const moment = moments.find(m => m.id === momentSquare.momentId);
            if (moment) {
                square.title = moment.title;
                square.addEventListener('click', () => showMomentCard(moment));
            }
        }
        
        // Check if this is a ladder start
        const ladder = gameConfig.ladders.find(l => l.from === number);
        if (ladder) {
            square.classList.add('ladder');
            square.innerHTML = `<span>${number}</span><br><small>↗️</small>`;
        }
        // Check if this is a snake start
        else if (gameConfig.snakes.find(s => s.from === number)) {
            square.classList.add('snake');
            square.innerHTML = `<span>${number}</span><br><small>🐍</small>`;
        }
        // Check if final square
        else if (number === gameConfig.finalSquare) {
            square.classList.add('final');
            square.textContent = '🏁';
        } else {
            square.textContent = number;
        }
        
        return square;
    }
    
    function rollDice() {
        if (isRolling || gameFinished) return;
        
        isRolling = true;
        rollButton.disabled = true;
        
        // Animate dice
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            diceDisplay.textContent = Math.floor(Math.random() * 6) + 1;
            rollCount++;
            
            if (rollCount > 10) {
                clearInterval(rollInterval);
                const finalRoll = Math.floor(Math.random() * 6) + 1;
                diceDisplay.textContent = finalRoll;
                movePlayer(finalRoll);
            }
        }, 100);
    }
    
    function movePlayer(steps) {
        const newPosition = Math.min(currentPosition + steps, gameConfig.boardSize);
        
        statusText.textContent = `Moving ${steps} steps...`;
        
        // Animate movement
        animateMovement(currentPosition, newPosition, () => {
            currentPosition = newPosition;
            
            // Check for snakes or ladders
            const snake = gameConfig.snakes.find(s => s.from === currentPosition);
            const ladder = gameConfig.ladders.find(l => l.from === currentPosition);
            
            if (snake) {
                setTimeout(() => {
                    statusText.textContent = 'Oh no! A snake! 🐍';
                    const moment = moments.find(m => m.id === snake.momentId);
                    if (moment) {
                        showMomentCard(moment);
                    }
                    setTimeout(() => {
                        currentPosition = snake.to;
                        updateTokenPosition();
                        statusText.textContent = `Slid down to ${snake.to}`;
                        enableNextRoll();
                    }, 2000);
                }, 500);
            } else if (ladder) {
                setTimeout(() => {
                    statusText.textContent = 'Yay! A ladder! ✨';
                    const moment = moments.find(m => m.id === ladder.momentId);
                    if (moment) {
                        showMomentCard(moment);
                    }
                    setTimeout(() => {
                        currentPosition = ladder.to;
                        updateTokenPosition();
                        statusText.textContent = `Climbed up to ${ladder.to}!`;
                        enableNextRoll();
                    }, 2000);
                }, 500);
            } else if (currentPosition === gameConfig.finalSquare) {
                gameFinished = true;
                statusText.textContent = gameConfig.finishingText;
                rollButton.textContent = 'Play Again';
                rollButton.disabled = false;
                rollButton.onclick = () => {
                    init(gameConfig, moments);
                };
            } else {
                // Check if there's a moment on this square
                const momentSquare = gameConfig.squareMoments.find(m => m.square === currentPosition);
                if (momentSquare) {
                    const moment = moments.find(m => m.id === momentSquare.momentId);
                    if (moment) {
                        showMomentCard(moment);
                    }
                }
                enableNextRoll();
            }
        });
    }
    
    function animateMovement(from, to, callback) {
        if (from === to) {
            callback();
            return;
        }
        
        let current = from;
        const step = () => {
            if (current < to) {
                current++;
                currentPosition = current;
                updateTokenPosition();
                requestAnimationFrame(() => setTimeout(step, 200));
            } else {
                callback();
            }
        };
        step();
    }
    
    function updateTokenPosition() {
        // Remove existing token
        const existingToken = gameBoard.querySelector('.player-token');
        if (existingToken) {
            existingToken.remove();
        }
        
        // Add token to current position
        const square = gameBoard.querySelector(`[data-square="${currentPosition}"]`);
        if (square) {
            const token = document.createElement('div');
            token.className = 'player-token';
            token.textContent = '❤️';
            token.setAttribute('aria-label', `Current position: ${currentPosition}`);
            square.appendChild(token);
        }
    }
    
    function showMomentCard(moment) {
        const container = document.getElementById('momentCardContainer');
        const isLow = moment.mood === 'low';
        
        container.innerHTML = `
            <div class="moment-card">
                <h3>${moment.title}</h3>
                <p class="moment-date">${formatDate(moment.date)}</p>
                <p class="moment-description">${moment.description}</p>
                ${isLow && moment.apology ? `
                    <div class="apology-message">
                        💕 ${moment.apology}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    function enableNextRoll() {
        isRolling = false;
        rollButton.disabled = false;
        if (!gameFinished) {
            statusText.textContent = 'Roll again!';
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    return {
        init
    };
})();
