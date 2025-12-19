// scenes/GameScene.js
// Escena principal del juego

class GameScene extends Scene {
    constructor(canvas) {
        super();
        const DEFAULT_BOARD_STYLE = PATHS.STYLE_TWO;
        const DEFAULT_CHALLENGE = BOARD_CONFIGS.CONFIG_2;
        this.canvas = canvas;
        this.tablero = new Tablero(DEFAULT_BOARD_STYLE, DEFAULT_CHALLENGE);
        this.inputHandler = new InputHandler(canvas);
        this.timer = null;
        this.timerDisplay = document.getElementById('display');
        this.restartBtn = document.getElementById('pegsolitaire-restart-btn');
        
        this.draggingFicha = null;
        this.timerStarted = false;
        this.animationTime = 0;

        this.setupInputHandlers();
        this.setupButtons();
    }

    setupButtons() {
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restart());
        }
    }

    setupInputHandlers() {
        this.inputHandler.onDragStart = (x, y) => {
            const cell = this.tablero.getCellFromCoords(x, y, this.canvas.width, this.canvas.height);
            if (!cell) return null;

            const casilla = this.tablero.casillas[cell.i][cell.j];
            if (casilla instanceof Ficha) {
                this.draggingFicha = {
                    ficha: casilla,
                    from: cell,
                    mouseX: x,
                    mouseY: y
                };
                return this.draggingFicha;
            }
            return null;
        };

        this.inputHandler.onDragMove = (x, y, dragData) => {
            if (dragData) {
                dragData.mouseX = x;
                dragData.mouseY = y;
            }
        };

        this.inputHandler.onDragEnd = (x, y, dragData) => {
            if (!dragData || !dragData.ficha) {
                this.draggingFicha = null;
                return;
            }

            const cell = this.tablero.getCellFromCoords(x, y, this.canvas.width, this.canvas.height);
            
            if (cell && this.tablero.validMove(dragData.from, cell)) {
                // Iniciar timer en el primer movimiento
                if (!this.timerStarted && this.timer) {
                    this.timer.start();
                    this.timerStarted = true;
                }

                // Realizar movimiento
                this.tablero.moveFicha(dragData.from, cell);

                // Verificar estado del juego
                const gameState = this.tablero.checkGameState();
                this.handleGameState(gameState);
            }

            this.draggingFicha = null;
        };
    }

    handleGameState(state) {
        if (state === 'won') {
            setTimeout(() => {
                this.sceneManager.switchTo('gameover', { 
                    won: true, 
                    fichas: 1,
                    time: this.timer ? this.timer.format() : '00:00:00'
                });
            }, 500);
        } else if (state === 'lost') {
            setTimeout(() => {
                const fichasRestantes = this.tablero.countFichas();
                this.sceneManager.switchTo('gameover', { 
                    won: false, 
                    fichas: fichasRestantes,
                    time: this.timer ? this.timer.format() : '00:00:00'
                });
            }, 500);
        }
    }

    restart() {
        this.tablero.init();
        if (this.timer) {
            this.timer.reset();
        }
        this.timerStarted = false;
        this.draggingFicha = null;
    }

    init(data) {
        super.init();
        this.tablero.init();
        if (data[0]) {
            this.tablero.setStylePath(data[0]); 
        }
        if (data[1]) {
            this.tablero.setChallengePath(data[1]); 
        }

        // Crear timer con callback
        this.timer = new Timer(GAME_CONFIG.TIMER_DURATION, () => {
            const fichasRestantes = this.tablero.countFichas();
            this.sceneManager.switchTo('gameover', { 
                won: false, 
                fichas: fichasRestantes,
                timeout: true,
                time: '00:00:00'
            });
        });
        
        this.timerStarted = false;
        this.draggingFicha = null;
        this.animationTime = 0;
    }

    update(deltaTime) {
        this.animationTime += deltaTime;

        if (this.timer) {
            this.timer.update();
            if (this.timerDisplay) {
                this.timerDisplay.textContent = this.timer.format();
            }
        }
    }

    render(ctx) {
        // Fondo
        this.tablero.renderBackground(ctx);
        
        // Casillas y fichas
        this.tablero.renderCasillas(ctx);

        // Hints si se está arrastrando
        if (this.draggingFicha && this.draggingFicha.ficha) {
            this.renderHints(ctx, this.draggingFicha.from);
            this.renderDraggingFicha(ctx);
        }
    }

    renderHints(ctx, from) {
        const validMoves = this.tablero.getValidMoves(from);
        const offset = this.tablero.getBoardOffset(ctx.canvas.width, ctx.canvas.height);

        for (const move of validMoves) {
            const x = offset.x + move.to.j * this.tablero.cellSize + this.tablero.cellSize / 2;
            const y = offset.y + move.to.i * this.tablero.cellSize + this.tablero.cellSize / 2;
            this.drawAnimatedArrow(ctx, x, y, move.dir);
        }
    }

    drawAnimatedArrow(ctx, x, y, dir) {
        const scale = 1 + 0.2 * Math.sin(this.animationTime * 0.005);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.beginPath();
        
        // Dibujar flecha según dirección
        if (Math.abs(dir.di) === 2 || Math.abs(dir.di) === 3) {
            if (dir.di < 0) { // arriba
                ctx.moveTo(0, -20);
                ctx.lineTo(-10, 0);
                ctx.lineTo(10, 0);
            } else { // abajo
                ctx.moveTo(0, 20);
                ctx.lineTo(-10, 0);
                ctx.lineTo(10, 0);
            }
        } else {
            if (dir.dj < 0) { // izquierda
                ctx.moveTo(-20, 0);
                ctx.lineTo(0, -10);
                ctx.lineTo(0, 10);
            } else { // derecha
                ctx.moveTo(20, 0);
                ctx.lineTo(0, -10);
                ctx.lineTo(0, 10);
            }
        }
        
        ctx.closePath();
        ctx.fillStyle = COLORS.HINT_COLOR;
        ctx.shadowColor = COLORS.HINT_SHADOW;
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
    }

    renderDraggingFicha(ctx) {
        if (!this.draggingFicha) return;
        
        const size = this.tablero.cellSize;
        const x = this.draggingFicha.mouseX - size / 2;
        const y = this.draggingFicha.mouseY - size / 2;
        
        this.draggingFicha.ficha.render(ctx, x, y, size);
    }

    cleanup() {
        super.cleanup();
        if (this.timer) {
            this.timer.pause();
        }
        this.draggingFicha = null;
    }
}