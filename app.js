const player = (sign) => {
    this.sign = sign;
  
    let score = 0;

    const getSign = () => {
      return sign;
    };

    const addScore = () => {
        score++;
    }

    const getScore = () => {
        return score;
    }
  
    return {getSign, addScore, getScore};
  };

const gameBoard = (() => {
    let board = Array(9).fill(null);

    const setPosition = (index, playerSign) => {
        board[index] = playerSign
    }

    const getPosition = (index) => {
        return board[index]
    }
    
    const reset = () => {
        board = board.map(boardPosition => boardPosition = null)
    }

    return {getPosition, setPosition, reset}
})();


const displayController = (() => {
    const positions = document.querySelectorAll('.position');
    const message = document.querySelector('.message');
    const restart = document.querySelector('.restart');
    const player1 = document.querySelector('#xScore');
    const player2 = document.querySelector('#oScore');

    positions.forEach(position => {
        position.addEventListener('click', function(e) {
            const boardPosition = e.target.dataset.key;
            if (gameController.getGameStatus() || gameBoard.getPosition(boardPosition) !== null) return;
            gameController.playerTurn(boardPosition);
        })
    })

    restart.addEventListener('click', function() {
        gameController.reset()
    })

    const updateDisplayBoard = (player, index) => {
        positions[index].textContent = player   
    }
    
    const gameMessage = (stat) => {
        message.textContent = stat
    }

    const updateScore = (player = null) => {
        if (player.getSign() === 'X') player1.textContent = player.getScore();
        else player2.textContent = player.getScore();
    }

    return {updateDisplayBoard, gameMessage, updateScore}
})();


const gameController = (() => {
    let turns = 1;
    const player1 = player('X');
    const player2 = player('O');
    let isOver = false;

    const getGameStatus = () => isOver;

    const playerTurn = (index) => {
        const player = currentPlayer().getSign();
        gameBoard.setPosition(index, player)
        displayController.updateDisplayBoard(currentPlayer().getSign(), index)
        if (checkWinner(index, player)) {
            currentPlayer().addScore();
            displayController.updateScore(currentPlayer());
            return gameOver(`Player ${player} Win!`);
        }
        if (turns === 9) return gameOver('Draw!')
        turns++
        displayController.gameMessage(`Player ${currentPlayer().getSign()}'s turn!`)
    }

    const checkWinner = (index, player) => {
        const winCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        return winCombinations.filter(combination => combination.includes(+index))
        .some(combination => combination.every(i => gameBoard.getPosition(i) === player))
    }

    const currentPlayer = () => {
        return (turns % 2 === 0) ? player2 : player1;
    }

    const gameOver = (message) => {
        displayController.gameMessage(message)
        isOver = true

    }

    const reset = () => {
        turns = 1;
        isOver = false;
        gameBoard.reset();
        for (i = 0; i < 9; i++) {
            displayController.updateDisplayBoard('', i);
        }
        displayController.gameMessage(`Player ${currentPlayer().getSign()}'s turn!`);
    }

    return {playerTurn, checkWinner, getGameStatus, reset, currentPlayer}
})();

