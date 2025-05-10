class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'RED';
        this.selectedPiece = null;
        this.isGameStarted = false;
        
        this.initializeUI();
        this.bindEvents();
    }

    initializeBoard() {
        // 初始化棋盤
        const board = Array(10).fill(null).map(() => Array(9).fill(null));
        // 設置初始棋子位置
        const initialLayout = [
            ['車', '馬', '象', '士', '將', '士', '象', '馬', '車'],
            [null, null, null, null, null, null, null, null, null],
            [null, '砲', null, null, null, null, null, '砲', null],
            ['卒', null, '卒', null, '卒', null, '卒', null, '卒'],
            // ... 中間空白
            ['兵', null, '兵', null, '兵', null, '兵', null, '兵'],
            [null, '炮', null, null, null, null, null, '炮', null],
            [null, null, null, null, null, null, null, null, null],
            ['俥', '傌', '相', '仕', '帥', '仕', '相', '傌', '俥']
        ];
        
        // 複製初始布局到棋盤
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
        this.startButton = document.getElementById('start-button');
        
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

    // ... 其他遊戲邏輯方法 ...
}

// 初始化遊戲
const game = new ChessGame();