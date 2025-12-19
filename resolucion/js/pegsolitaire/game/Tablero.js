// game/Tablero.js
// Lógica del tablero del juego

class Tablero {
    constructor(boardStylePath, boardChallengePath) {
        this.stylePath = boardStylePath;
        this.challengePath = boardChallengePath;
        this.fondo = new Image();
        this.casillas = [];
        this.cellSize = GAME_CONFIG.CELL_SIZE;
    }

    init() {
        // Configurar la imagen de fondo
        this.fondo.src = this.stylePath.BOARD_BG;
        
        // Inicializar el tablero desde el challengePath
        this.casillas = JSON.parse(JSON.stringify(this.challengePath)); // Copia profunda del array
        
        for (let i = 0; i < this.casillas.length; i++) {
            for (let j = 0; j < this.casillas[i].length; j++) {
                const cellValue = this.casillas[i][j];
                if (typeof cellValue === 'string') {
                    this.casillas[i][j] = this.createFicha(cellValue, this.stylePath);
                }
            }
        }
    }

    setStylePath(value) {
        this.stylePath = value;
        this.fondo.src = value.BOARD_BG;
    
        // Actualiza el path de todas las fichas existentes.
        for (let i = 0; i < this.casillas.length; i++) {
            for (let j = 0; j < this.casillas[i].length; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    const fichaType = this.getFichaType(this.casillas[i][j]);
                    this.casillas[i][j] = this.createFicha(fichaType, value);
                }
            }
        }
    }

    setChallengePath(value) {
        this.challengePath = value;
        this.init();
    }

    getFichaType(ficha) {
        if (ficha instanceof FichaAzul) return 'azul';
        if (ficha instanceof FichaRoja) return 'roja';
        if (ficha instanceof FichaVioleta) return 'violeta';
        return null;
    }

    createFicha(type, stylePath) {
        switch (type) {
            case 'azul':
                return new FichaAzul(stylePath);
            case 'roja':
                return new FichaRoja(stylePath);
            case 'violeta':
                return new FichaVioleta(stylePath);
            default:
                return null;
        }
    }

    getBoardOffset(canvasWidth, canvasHeight) {
        const rows = this.casillas.length;
        const cols = this.casillas[0].length;
        const boardWidth = cols * this.cellSize;
        const boardHeight = rows * this.cellSize;
        return {
            x: (canvasWidth - boardWidth) / 2,
            y: (canvasHeight - boardHeight) / 2,
            boardWidth,
            boardHeight
        };
    }

    getCellFromCoords(mx, my, canvasWidth, canvasHeight) {
        const offset = this.getBoardOffset(canvasWidth, canvasHeight);
        const j = Math.floor((mx - offset.x) / this.cellSize);
        const i = Math.floor((my - offset.y) / this.cellSize);

        const rows = this.casillas.length;
        const cols = this.casillas[0].length;

        if (i >= 0 && i < rows && j >= 0 && j < cols) {
            return { i, j };
        }
        return null;
    }

    validMove(from, to) {
        if (!from || !to) return false;

        const ficha = this.casillas[from.i][from.j];
        if (!(ficha instanceof Ficha)) return false;
        if (this.casillas[to.i][to.j] !== 0) return false;

        const di = to.i - from.i;
        const dj = to.j - from.j;

        // Salto de 2 celdas (comer 1 ficha)
        if (Math.abs(di) === 2 && dj === 0) {
            const midI = from.i + (di > 0 ? 1 : -1);
            return this.casillas[midI][from.j] instanceof Ficha;
        }

        if (Math.abs(dj) === 2 && di === 0) {
            const midJ = from.j + (dj > 0 ? 1 : -1);
            return this.casillas[from.i][midJ] instanceof Ficha;
        }

        // Salto de 3 celdas (comer 2 fichas)
        if (Math.abs(di) === 3 && dj === 0) {
            const mid1I = from.i + (di > 0 ? 1 : -1);
            const mid2I = from.i + (di > 0 ? 2 : -2);
            return (this.casillas[mid1I][from.j] instanceof Ficha) &&
                   (this.casillas[mid2I][from.j] instanceof Ficha);
        }

        if (Math.abs(dj) === 3 && di === 0) {
            const mid1J = from.j + (dj > 0 ? 1 : -1);
            const mid2J = from.j + (dj > 0 ? 2 : -2);
            return (this.casillas[from.i][mid1J] instanceof Ficha) &&
                   (this.casillas[from.i][mid2J] instanceof Ficha);
        }

        return false;
    }

    moveFicha(from, to) {
        if (!this.validMove(from, to)) return false;

        const ficha = this.casillas[from.i][from.j];
        const di = to.i - from.i;
        const dj = to.j - from.j;

        // Eliminar fichas intermedias según el tipo de salto
        if (Math.abs(di) === 2 && dj === 0) {
            const midI = from.i + (di > 0 ? 1 : -1);
            this.casillas[midI][from.j] = 0;
        } else if (Math.abs(dj) === 2 && di === 0) {
            const midJ = from.j + (dj > 0 ? 1 : -1);
            this.casillas[from.i][midJ] = 0;
        } else if (Math.abs(di) === 3 && dj === 0) {
            const mid1I = from.i + (di > 0 ? 1 : -1);
            const mid2I = from.i + (di > 0 ? 2 : -2);
            this.casillas[mid1I][from.j] = 0;
            this.casillas[mid2I][from.j] = 0;
        } else if (Math.abs(dj) === 3 && di === 0) {
            const mid1J = from.j + (dj > 0 ? 1 : -1);
            const mid2J = from.j + (dj > 0 ? 2 : -2);
            this.casillas[from.i][mid1J] = 0;
            this.casillas[from.i][mid2J] = 0;
        }

        // Mover la ficha
        this.casillas[from.i][from.j] = 0;
        this.casillas[to.i][to.j] = ficha;
        return true;
    }

    getValidMoves(from) {
        const validMoves = [];
        const rows = this.casillas.length;
        const cols = this.casillas[0].length;

        const allDirections = [...DIRECTIONS.JUMP_2, ...DIRECTIONS.JUMP_3];

        for (const dir of allDirections) {
            const to = { i: from.i + dir.di, j: from.j + dir.dj };
            if (to.i >= 0 && to.i < rows && to.j >= 0 && to.j < cols) {
                if (this.validMove(from, to)) {
                    validMoves.push({ to, dir });
                }
            }
        }

        return validMoves;
    }

    countFichas() {
        let count = 0;
        for (let i = 0; i < this.casillas.length; i++) {
            for (let j = 0; j < this.casillas[i].length; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    count++;
                }
            }
        }
        return count;
    }

    hasValidMoves() {
        const rows = this.casillas.length;
        const cols = this.casillas[0].length;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.casillas[i][j] instanceof Ficha) {
                    const moves = this.getValidMoves({ i, j });
                    if (moves.length > 0) return true;
                }
            }
        }
        return false;
    }

    checkGameState() {
        const fichasRestantes = this.countFichas();

        if (fichasRestantes === 1) {
            const centerI = Math.floor(this.casillas.length / 2);
            const centerJ = Math.floor(this.casillas[0].length / 2);
            if (this.casillas[centerI][centerJ] instanceof Ficha) {
                return 'won';
            } else {
                return 'lost';
            }
        }

        if (!this.hasValidMoves()) {
            return 'lost';
        }

        return 'playing';
    }

    renderBackground(ctx) {
        if (this.fondo.complete) {
            ctx.drawImage(this.fondo, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    renderCasillas(ctx) {
        const rows = this.casillas.length;
        const cols = this.casillas[0].length;
        const offset = this.getBoardOffset(ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = offset.x + j * this.cellSize;
                const y = offset.y + i * this.cellSize;
                const casilla = this.casillas[i][j];

                // No dibujar si es null (esquina inválida) o 0 (vacío)
                if (casilla === null || casilla === 0) continue;

                // Dibujar círculo de casilla
                ctx.save();
                ctx.strokeStyle = COLORS.CELL_STROKE;
                ctx.lineWidth = 2;
                ctx.fillStyle = COLORS.CELL_FILL;
                ctx.beginPath();
                ctx.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2.2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.restore();

                // Dibujar ficha si existe
                if (casilla instanceof Ficha) {
                    casilla.render(ctx, x, y, this.cellSize);
                }
            }
        }
    }
}