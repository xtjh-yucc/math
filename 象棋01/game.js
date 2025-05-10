class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'RED';
        this.selectedPiece = null;
        this.isGameStarted = false;
        this.players = {
            RED: { isReady: false },
            BLACK: { isReady: false }
        };
        
        this.initializeUI();
        this.bindEvents();
    }

    initializeBoard() {
        const board = Array(10).fill(null).map(() => Array(9).fill(null));
        const initialLayout = [
            ['車', '馬', '象', '士', '將', '士', '象', '馬', '車'],
            [null, null, null, null, null, null, null, null, null],
            [null, '砲', null, null, null, null, null, '砲', null],
            ['卒', null, '卒', null, '卒', null, '卒', null, '卒'],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            ['兵', null, '兵', null, '兵', null, '兵', null, '兵'],
            [null, '炮', null, null, null, null, null, '炮', null],
            [null, null, null, null, null, null, null, null, null],
            ['俥', '傌', '相', '仕', '帥', '仕', '相', '傌', '俥']
        ];
        
        initialLayout.forEach((row, i) => {
            row.forEach((piece, j) => {
                board[i][j] = piece;
            });
        });
        
        return board;
    }

    initializeUI() {
        this.boardElement = document.getElementById('chess-board');
        this.statusMessage = document.getElementById('status-message');
        this.redReadyButton = document.getElementById('red-ready');
        this.blackReadyButton = document.getElementById('black-ready');
        this.restartButton = document.getElementById('restart-button');
        this.restartContainer = document.getElementById('restart-container');
        
        this.renderBoard();
    }

    bindEvents() {
        this.redReadyButton.addEventListener('click', () => this.handlePlayerReady('RED'));
        this.blackReadyButton.addEventListener('click', () => this.handlePlayerReady('BLACK'));
        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handlePlayerReady(player) {
        this.players[player].isReady = true;
        document.getElementById(`${player.toLowerCase()}-ready`).disabled = true;
        document.getElementById(`${player.toLowerCase()}-ready`).classList.add('disabled');
        
        if (this.players.RED.isReady && this.players.BLACK.isReady) {
            this.startGame();
        } else {
            this.updateStatus();
        }
    }

    startGame() {
        this.isGameStarted = true;
        this.updateStatus();
    }

    updateStatus() {
        const readyCount = Object.values(this.players).filter(p => p.isReady).length;
        if (!this.isGameStarted) {
            this.statusMessage.textContent = `等待玩家準備 (${readyCount}/2)`;
        } else {
            this.statusMessage.textContent = `當前回合：${this.currentPlayer === 'RED' ? '紅方' : '黑方'}`;
        }
    }

    handleBoardClick(e) {
        if (!this.isGameStarted) return;

        const cell = e.target.closest('.board-cell');
        const piece = e.target.closest('.chess-piece');

        if (piece && !this.selectedPiece) {
            if (this.getPieceColor(piece.textContent) === this.currentPlayer.toLowerCase()) {
                this.selectedPiece = piece;
                piece.classList.add('selected');
            }
        } else if (cell && this.selectedPiece) {
            const fromRow = parseInt(this.selectedPiece.parentElement.dataset.row);
            const fromCol = parseInt(this.selectedPiece.parentElement.dataset.col);
            const toRow = parseInt(cell.dataset.row);
            const toCol = parseInt(cell.dataset.col);

            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                this.movePiece(fromRow, fromCol, toRow, toCol);
            }

            this.selectedPiece.classList.remove('selected');
            this.selectedPiece = null;
        }
    }
    movePiece(fromRow, fromCol, toRow, toCol) {
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        
        const checkStatus = this.checkGameStatus();
        if (checkStatus.isCheckmate) {
            this.statusMessage.textContent = `將死！${this.currentPlayer === 'RED' ? '紅方' : '黑方'}獲勝！`;
            this.isGameStarted = false;
            this.restartContainer.style.display = 'block';
        } else if (checkStatus.isCheck) {
            this.statusMessage.textContent = `將軍！`;
            this.currentPlayer = this.currentPlayer === 'RED' ? 'BLACK' : 'RED';
        } else {
            this.currentPlayer = this.currentPlayer === 'RED' ? 'BLACK' : 'RED';
            this.updateStatus();
        }
        
        this.renderBoard();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.board[i][j]) {
                    const piece = document.createElement('div');
                    piece.className = `chess-piece ${this.getPieceColor(this.board[i][j])}`;
                    piece.textContent = this.board[i][j];
                    cell.appendChild(piece);
                }
                
                this.boardElement.appendChild(cell);
            }
        }
    }

    getPieceColor(piece) {
        return '車馬象士將砲卒'.includes(piece) ? 'black' : 'red';
    }

    restartGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'RED';
        this.selectedPiece = null;
        this.isGameStarted = false;
        this.players = {
            RED: { isReady: false },
            BLACK: { isReady: false }
        };

        this.restartContainer.style.display = 'none';
        this.redReadyButton.disabled = false;
        this.redReadyButton.classList.remove('disabled');
        this.blackReadyButton.disabled = false;
        this.blackReadyButton.classList.remove('disabled');
        this.statusMessage.textContent = '等待玩家準備';

        this.renderBoard();
    }

        isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];

        if (targetPiece && this.getPieceColor(targetPiece) === this.getPieceColor(piece)) {
            return false;
        }

        switch (piece) {
            case '將':
            case '帥':
                return this.isValidGeneralMove(fromRow, fromCol, toRow, toCol);
            case '士':
            case '仕':
                return this.isValidAdvisorMove(fromRow, fromCol, toRow, toCol);
            case '象':
            case '相':
                return this.isValidElephantMove(fromRow, fromCol, toRow, toCol);
            case '馬':
            case '傌':
                return this.isValidHorseMove(fromRow, fromCol, toRow, toCol);
            case '車':
            case '俥':
                return this.isValidChariotMove(fromRow, fromCol, toRow, toCol);
            case '砲':
            case '炮':
                return this.isValidCannonMove(fromRow, fromCol, toRow, toCol);
            case '卒':
            case '兵':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol);
            default:
                return false;
        }
    }

    isValidGeneralMove(fromRow, fromCol, toRow, toCol) {
        const isBlack = fromRow < 5;
        const inPalace = (row, col) => {
            if (isBlack) {
                return row <= 2 && col >= 3 && col <= 5;
            } else {
                return row >= 7 && col >= 3 && col <= 5;
            }
        };

        if (!inPalace(toRow, toCol)) return false;

        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    isValidAdvisorMove(fromRow, fromCol, toRow, toCol) {
        const isBlack = fromRow < 5;
        const inPalace = (row, col) => {
            if (isBlack) {
                return row <= 2 && col >= 3 && col <= 5;
            } else {
                return row >= 7 && col >= 3 && col <= 5;
            }
        };

        if (!inPalace(toRow, toCol)) return false;

        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return rowDiff === 1 && colDiff === 1;
    }

     isValidElephantMove(fromRow, fromCol, toRow, toCol) {
        const isBlack = fromRow < 5;
        if (isBlack && toRow > 4) return false;
        if (!isBlack && toRow < 5) return false;

        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff !== 2 || colDiff !== 2) return false;

        const eyeRow = (fromRow + toRow) / 2;
        const eyeCol = (fromCol + toCol) / 2;
        return !this.board[eyeRow][eyeCol];
    }

    isValidHorseMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
            return false;
        }

        if (rowDiff === 2) {
            const legRow = fromRow + (toRow > fromRow ? 1 : -1);
            return !this.board[legRow][fromCol];
        } else {
            const legCol = fromCol + (toCol > fromCol ? 1 : -1);
            return !this.board[fromRow][legCol];
        }
    }

    isValidChariotMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;

        if (fromRow === toRow) {
            const minCol = Math.min(fromCol, toCol);
            const maxCol = Math.max(fromCol, toCol);
            for (let col = minCol + 1; col < maxCol; col++) {
                if (this.board[fromRow][col]) return false;
            }
        } else {
            const minRow = Math.min(fromRow, toRow);
            const maxRow = Math.max(fromRow, toRow);
            for (let row = minRow + 1; row < maxRow; row++) {
                if (this.board[row][fromCol]) return false;
            }
        }
        return true;
    }

    isValidCannonMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;

        let pieceCount = 0;
        
        if (fromRow === toRow) {
            const minCol = Math.min(fromCol, toCol);
            const maxCol = Math.max(fromCol, toCol);
            for (let col = minCol + 1; col < maxCol; col++) {
                if (this.board[fromRow][col]) pieceCount++;
            }
        } else {
            const minRow = Math.min(fromRow, toRow);
            const maxRow = Math.max(fromRow, toRow);
            for (let row = minRow + 1; row < maxRow; row++) {
                if (this.board[row][fromCol]) pieceCount++;
            }
        }

        return this.board[toRow][toCol] ? pieceCount === 1 : pieceCount === 0;
    }

       isValidPawnMove(fromRow, fromCol, toRow, toCol) {
        const isBlack = this.getPieceColor(this.board[fromRow][fromCol]) === 'black';
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        if (isBlack && rowDiff < 0) return false;
        if (!isBlack && rowDiff > 0) return false;

        if (isBlack && fromRow < 5 || !isBlack && fromRow > 4) {
            return colDiff === 0 && Math.abs(rowDiff) === 1;
        }

        return (colDiff === 1 && rowDiff === 0) || 
               (colDiff === 0 && Math.abs(rowDiff) === 1);
    }

    checkGameStatus() {
        const currentColor = this.currentPlayer.toLowerCase();
        const opponentKing = this.findKing(currentColor === 'red' ? 'BLACK' : 'RED');
        
        const isCheck = this.isKingUnderAttack(opponentKing, currentColor);
        const isCheckmate = isCheck && this.isCheckmate(opponentKing, currentColor);

        return { isCheck, isCheckmate };
    }

    findKing(color) {
        const kingChar = color === 'BLACK' ? '將' : '帥';
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === kingChar) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isKingUnderAttack(kingPos, attackerColor) {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece && this.getPieceColor(piece) === attackerColor) {
                    if (this.isValidMove(row, col, kingPos.row, kingPos.col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(kingPos, attackerColor) {
        // 檢查王是否可以移動到安全位置
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dx, dy] of directions) {
            const newRow = kingPos.row + dx;
            const newCol = kingPos.col + dy;
            
            if (this.isValidKingEscape(kingPos.row, kingPos.col, newRow, newCol, attackerColor)) {
                return false;
            }
        }

        return !this.canBlockOrCaptureAttacker(kingPos, attackerColor);
    }
}

// 初始化遊戲
const game = new ChessGame();