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
        
        this.renderBoard();
    }

    bindEvents() {
        this.redReadyButton.addEventListener('click', () => this.handlePlayerReady('RED'));
        this.blackReadyButton.addEventListener('click', () => this.handlePlayerReady('BLACK'));
        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
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
}

// 初始化遊戲
const game = new ChessGame();