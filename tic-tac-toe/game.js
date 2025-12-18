/**
 * TicTacToe game class
 * Implements the game logic and AI
 */
class TicTacToe {
    constructor() {
        // Initialize game state
        this.board = Array(9).fill(null); // 3x3 game board
        this.currentPlayer = 'X'; // Human player starts as X
        this.gameActive = true; // Game state flag
        this.difficulty = 'medium'; // Default AI difficulty
        this.moveHistory = new Stack(); // Stack to track moves for undo
        this.redoHistory = new Queue(); // Queue to track moves for redo
        this.reviewMode = false; // Review mode flag
        this.allMoves = []; // Array to store all moves for review
        this.reviewIndex = -1; // Current position in review mode
        this.aiRandomMovesUsed = 0; // Counter for AI random moves

        this.initializeGame();
    }

    /**
     * Initialize the game by setting up event listeners
     */
    initializeGame() {
        this.setupEventListeners();
        this.updateStatus();
    }

    /**
     * Set up all event listeners for the game
     */
    setupEventListeners() {
        // Add click listeners to each cell
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        // Add click listeners to difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setDifficulty(e));
        });

        // Add click listeners to control buttons
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('backwardBtn').addEventListener('click', () => this.moveBackward());
        document.getElementById('forwardBtn').addEventListener('click', () => this.moveForward());
        document.getElementById('reviewBtn').addEventListener('click', () => this.startReview());
    }

    /**
     * Handle cell click event
     * @param {Event} e - Click event
     */
    handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);
        
        // Ignore clicks if game is not active, cell is occupied, or not player's turn
        if (this.reviewMode || !this.gameActive || this.board[index] !== null || this.currentPlayer !== 'X') {
            return;
        }

        // Make player move
        this.makeMove(index, 'X');
        
        // If game is still active and it's computer's turn, make computer move
        if (this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 500); // Add delay for better UX
        }
    }

    /**
     * Make a move on the board
     * @param {number} index - Cell index (0-8)
     * @param {string} player - Player making the move ('X' or 'O')
     */
    makeMove(index, player) {
        // Update board with player's move
        this.board[index] = player;
        
        // Store move data for history
        const moveData = { 
            index, 
            player, 
            board: [...this.board], // Copy of current board state
            aiRandomMovesUsed: this.aiRandomMovesUsed 
        };
        
        // Add move to history
        this.allMoves.push(moveData);
        this.moveHistory.push(moveData);
        this.redoHistory.clear(); // Clear redo history when making a new move
        
        // Update UI
        this.updateBoard();
        this.updateMoveCounter();
        
        // Check for win condition
        if (this.checkWinner(player)) {
            this.gameActive = false;
            this.updateStatus(`${player} wins!`);
            document.getElementById('reviewBtn').disabled = false; // Enable review button
            return;
        }

        // Check for draw condition
        if (this.board.every(cell => cell !== null)) {
            this.gameActive = false;
            this.updateStatus("It's a draw!");
            document.getElementById('reviewBtn').disabled = false; // Enable review button
            return;
        }

        // Switch to next player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    /**
     * Computer AI move logic
     */
    computerMove() {
        if (!this.gameActive) return;

        let move;
        // Get indices of empty cells
        const emptyIndices = this.board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
        
        // Check for immediate win opportunity for AI
        const aiWinMove = this.findWinningMove('O');
        if (aiWinMove !== -1) {
            move = aiWinMove;
        }
        // Check for immediate win opportunity for human
        else if (this.findWinningMove('X') !== -1) {
            move = this.findWinningMove('X');
        }
        // If no immediate win/loss, proceed with difficulty-based logic
        else if (this.difficulty === 'hard') {
            // Hard: Always use optimal minimax algorithm
            move = this.minimax(this.board, 'O').index;
        } else if (this.difficulty === 'medium') {
            // Medium: Make 1 random move, then use minimax
            if (this.aiRandomMovesUsed < 1) {
                move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                this.aiRandomMovesUsed++;
            } else {
                move = this.minimax(this.board, 'O').index;
            }
        } else {
            // Easy: Make 2 random moves, then use minimax
            if (this.aiRandomMovesUsed < 2) {
                move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                this.aiRandomMovesUsed++;
            } else {
                move = this.minimax(this.board, 'O').index;
            }
        }

        // Make the selected move
        this.makeMove(move, 'O');
    }

    /**
     * Find a winning move for a player
     * @param {string} player - Player to check ('X' or 'O')
     * @returns {number} Index of winning move, or -1 if none found
     */
    findWinningMove(player) {
        const emptyIndices = this.board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
        
        for (let i = 0; i < emptyIndices.length; i++) {
            const index = emptyIndices[i];
            // Try the move
            this.board[index] = player;
            // Check if this move wins the game
            const wins = this.checkWinner(player);
            // Undo the move
            this.board[index] = null;
            
            if (wins) {
                return index;
            }
        }
        return -1;
    }

    /**
     * Minimax algorithm for optimal AI moves
     * @param {Array} board - Current board state
     * @param {string} player - Current player ('X' or 'O')
     * @returns {Object} Best move with index and score
     */
    minimax(board, player) {
        // Get indices of empty cells
        const emptyIndices = board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
        
        // Check for terminal states (win/loss/draw)
        if (this.checkWinner('X', board)) {
            return { score: -10 }; // Human wins
        } else if (this.checkWinner('O', board)) {
            return { score: 10 }; // AI wins
        } else if (emptyIndices.length === 0) {
            return { score: 0 }; // Draw
        }

        // Array to store all possible moves
        const moves = [];

        // Evaluate all possible moves
        for (let i = 0; i < emptyIndices.length; i++) {
            const move = {};
            move.index = emptyIndices[i];
            
            // Make the move
            board[move.index] = player;

            // Recursively evaluate the move
            if (player === 'O') {
                const result = this.minimax(board, 'X');
                move.score = result.score;
            } else {
                const result = this.minimax(board, 'O');
                move.score = result.score;
            }

            // Undo the move
            board[move.index] = null;
            moves.push(move);
        }

        // Select the best move
        let bestMove;
        if (player === 'O') {
            // AI (O) wants to maximize score
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            // Human (X) wants to minimize score
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    /**
     * Check if a player has won
     * @param {string} player - Player to check ('X' or 'O')
     * @param {Array} board - Board state to check (defaults to current board)
     * @returns {boolean} True if player has won
     */
    checkWinner(player, board = this.board) {
        // All possible winning combinations
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // Check if any winning pattern is satisfied
        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }

    /**
     * Move backward (undo) functionality
     */
    moveBackward() {
        if (this.reviewMode) {
            // In review mode: navigate to previous move
            if (this.reviewIndex > 0) {
                this.reviewIndex--;
                this.displayReviewMove();
            }
        } else {
            // In normal mode: undo the last move
            const lastMove = this.moveHistory.pop();
            if (!lastMove) return;

            // Add move to redo queue
            this.redoHistory.enqueue(lastMove);
            this.allMoves.pop();

            // Restore previous game state
            if (this.moveHistory.isEmpty()) {
                // If no moves left, reset to initial state
                this.board = Array(9).fill(null);
                this.currentPlayer = 'X';
                this.aiRandomMovesUsed = 0;
            } else {
                // Restore state from previous move
                const prevMove = this.moveHistory.peek();
                this.board = [...prevMove.board];
                this.currentPlayer = prevMove.player === 'X' ? 'O' : 'X';
                this.aiRandomMovesUsed = prevMove.aiRandomMovesUsed;
            }

            // Reactivate game and update UI
            this.gameActive = true;
            this.updateBoard();
            this.updateStatus();
            this.updateMoveCounter();
            document.getElementById('reviewBtn').disabled = true; // Disable review until game ends
        }

        this.updateNavigationButtons();
    }

    /**
     * Move forward (redo) functionality
     */
    moveForward() {
        if (this.reviewMode) {
            // In review mode: navigate to next move
            if (this.reviewIndex < this.allMoves.length - 1) {
                this.reviewIndex++;
                this.displayReviewMove();
            }
        } else {
            // In normal mode: redo the next move
            const nextMove = this.redoHistory.dequeue();
            if (!nextMove) return;

            // Restore state from next move
            this.board = [...nextMove.board];
            this.currentPlayer = nextMove.player === 'X' ? 'O' : 'X';
            this.aiRandomMovesUsed = nextMove.aiRandomMovesUsed;
            
            // Add move back to history
            this.moveHistory.push(nextMove);
            this.allMoves.push(nextMove);

            // Update UI
            this.updateBoard();
            this.updateStatus();
            this.updateMoveCounter();

            // Check if game ended after redo
            if (this.checkWinner('X') || this.checkWinner('O') || this.board.every(cell => cell !== null)) {
                this.gameActive = false;
                document.getElementById('reviewBtn').disabled = false; // Enable review button
            }
        }

        this.updateNavigationButtons();
    }

    /**
     * Start review mode to navigate through game history
     */
    startReview() {
        if (this.allMoves.length === 0) return;

        // Enter review mode
        this.reviewMode = true;
        this.reviewIndex = -1;
        this.board = Array(9).fill(null);
        
        // Show review mode indicator
        document.getElementById('reviewMode').style.display = 'block';
        
        // Update UI for review mode
        this.updateBoard();
        this.updateStatus('Review Mode: Use Forward to see moves');
        this.updateNavigationButtons();
    }

    /**
     * Display a specific move in review mode
     */
    displayReviewMove() {
        if (this.reviewIndex >= 0 && this.reviewIndex < this.allMoves.length) {
            // Display the move at current review index
            const move = this.allMoves[this.reviewIndex];
            this.board = [...move.board];
            this.updateBoard();
            this.updateStatus(`Review Mode: Move ${this.reviewIndex + 1} of ${this.allMoves.length} - ${move.player} played`);
        } else {
            // Display empty board at start of review
            this.board = Array(9).fill(null);
            this.updateBoard();
            this.updateStatus('Review Mode: Start of game');
        }
    }

    /**
     * Update navigation buttons state based on current mode
     */
    updateNavigationButtons() {
        if (this.reviewMode) {
            // In review mode: enable/disable based on review index
            document.getElementById('backwardBtn').disabled = this.reviewIndex <= -1;
            document.getElementById('forwardBtn').disabled = this.reviewIndex >= this.allMoves.length - 1;
        } else {
            // In normal mode: enable/disable based on history availability
            document.getElementById('backwardBtn').disabled = this.moveHistory.isEmpty();
            document.getElementById('forwardBtn').disabled = this.redoHistory.isEmpty();
        }
    }

    /**
     * Set game difficulty
     * @param {Event} e - Click event from difficulty button
     */
    setDifficulty(e) {
        this.difficulty = e.target.dataset.difficulty;
        
        // Update active difficulty button
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Reset game with new difficulty
        this.resetGame();
    }

    /**
     * Update the game board UI
     */
    updateBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            // Update cell content and styling
            cell.textContent = this.board[index] || '';
            cell.className = 'cell';
            if (this.board[index]) {
                cell.classList.add(this.board[index]); // Add X or O class for styling
            }
            
            // Disable cell if in review mode, game not active, or cell is occupied
            cell.disabled = this.reviewMode || !this.gameActive || this.board[index] !== null;
        });
    }

    /**
     * Update the game status display
     * @param {string} message - Optional custom status message
     */
    updateStatus(message = null) {
        const status = document.getElementById('status');
        if (message) {
            status.textContent = message;
        } else if (this.gameActive) {
            status.textContent = `${this.currentPlayer}'s turn ${this.currentPlayer === 'O' ? '(Computer)' : '(You)'}`;
        }
    }

    /**
     * Update the move counter display
     */
    updateMoveCounter() {
        const moveCount = this.moveHistory.size();
        document.getElementById('moveCounter').textContent = `Move: ${moveCount}`;
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        // Reset all game state variables
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.moveHistory.clear();
        this.redoHistory.clear();
        this.allMoves = [];
        this.reviewMode = false;
        this.reviewIndex = -1;
        this.aiRandomMovesUsed = 0;

        // Update UI
        document.getElementById('reviewMode').style.display = 'none';
        this.updateBoard();
        this.updateStatus();
        this.updateMoveCounter();
        this.updateNavigationButtons();
        document.getElementById('reviewBtn').disabled = true;
    }
}

// Initialize the game when the page loads
const game = new TicTacToe();