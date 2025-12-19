import Level from './Level.js';
import Timer from './Timer.js';
import Button from '../ui/Button.js';
import ImageLoader from '../utils/ImageLoader.js';

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1000;
        this.canvas.height = 600;
        
        this.difficulties = ['easy', 'medium', 'hard'];
        this.currentDifficultyIndex = 0;
        this.currentGridSizeIndex = 0;
        this.currentLevel = null;
        this.currentImage = null;
        this.gameFinished = false;
        this.currentTheme = 'NATURE';
        
        // UI elements
        this.menuButton = null;
        this.nextLevelButton = null;

        // Sounds
        this.rightPosition = new Audio("../media/blockaImages/success.mp3");
        this.gameBlockaClick = new Audio("../media/blockaImages/click.mp3");
        this.gameButtonClick = new Audio("../media/blockaImages/rotate.mp3");

        // Timer setup
        this.timer = new Timer(
            document.getElementById('display'),
            document.getElementById('max-time')
        );
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Mouse movement for button hover effects
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let anyHover = false;

        if (this.menuButton) {
            this.menuButton.hover = this.menuButton.isPointInside(mx, my);
            anyHover = anyHover || this.menuButton.hover;
        }
        if (this.nextLevelButton) {
            this.nextLevelButton.hover = this.nextLevelButton.isPointInside(mx, my);
            anyHover = anyHover || this.nextLevelButton.hover;
        }

        this.canvas.style.cursor = anyHover ? 'pointer' : 'default';
        this.draw();
    }

    handleMouseLeave() {
        if (this.menuButton) {
            this.menuButton.hover = false;
            this.menuButton.pressed = false;
        }
        if (this.nextLevelButton) {
            this.nextLevelButton.hover = false;
            this.nextLevelButton.pressed = false;
        }
        this.canvas.style.cursor = 'default';
        this.draw();
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        if (this.menuButton && this.menuButton.isPointInside(mx, my)) {
            this.menuButton.pressed = true;
        }
        if (this.nextLevelButton && this.nextLevelButton.isPointInside(mx, my)) {
            this.nextLevelButton.pressed = true;
        }
        
        // Tile rotation
        if (!this.gameFinished && this.currentLevel && !this.currentLevel.isCompleted()) {
            const tile = this.currentLevel.getTileAt(mx, my);

            if (tile) {
                if (e.button === 0) { // Left click
                    tile.rotateLeft();
                } else if (e.button === 2) { // Right click
                    tile.rotateRight();
                }
                
                this.gameBlockaClick.play();

                if (this.currentLevel.checkCompletion()) {
                    this.onLevelComplete();
                }
            }
        }
        
        this.draw();
    }

    handleMouseUp(e) {
        if (this.menuButton) this.menuButton.pressed = false;
        if (this.nextLevelButton) this.nextLevelButton.pressed = false;
        this.draw();
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Menu button
        if (this.menuButton && this.menuButton.isPointInside(x, y)) {
            this.gameButtonClick.play();
            this.returnToMenu();
            return;
        }

        // Next level button
        if (this.nextLevelButton && this.nextLevelButton.isPointInside(x, y)) {
            this.gameButtonClick.play();
            this.loadNextLevel();
            return;
        }
    }

    async start(imagePathOrIndex = null, theme = 'NATURE', gridSizeIndex = 0) {
        this.gameButtonClick.play();
        this.currentDifficultyIndex = 0;
        this.gameFinished = false;
        this.currentTheme = theme; // Guardar tema actual
        this.currentGridSizeIndex = gridSizeIndex;

        if (imagePathOrIndex !== null) {
            if (typeof imagePathOrIndex === 'string') {
                this.currentImage = await ImageLoader.loadImage(imagePathOrIndex);
            } else {
                const imagePath = ImageLoader.getImageByIndex(imagePathOrIndex);
                this.currentImage = await ImageLoader.loadImage(imagePath);
            }
        } else {
            this.currentImage = await ImageLoader.loadRandomImage(theme);
        }
        
        await this.loadLevel();
        
        const gameContainer = document.getElementById('GameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
        }
    }

    async loadLevel() {
        const difficulty = this.difficulties[this.currentDifficultyIndex];
        const gridSize = ImageLoader.getGridSize(this.currentGridSizeIndex);

        console.log('Loading level with:', { difficulty, gridSize, image: this.currentImage });

        this.timer.setDifficulty(difficulty);
        
        this.currentLevel = new Level(this.currentImage, difficulty, gridSize);
                
        this.menuButton = new Button(10, 10, 80, 50, 'MENU', 'rgba(132, 233, 221, 1)');
        this.nextLevelButton = null;
        
        this.draw();
        this.timer.reset();
        this.timer.start();
    }

    async loadNextLevel() {
        this.nextLevelButton = null;
        
        if (this.currentDifficultyIndex < this.difficulties.length - 1) {
            this.currentDifficultyIndex++;
            
            // Necesitas obtener el tema seleccionado desde el menú
            // Opción 1: Guardar el tema en el Game cuando se inicia
            this.currentImage = await ImageLoader.loadRandomImage(this.currentTheme);
            await this.loadLevel();
        } else {
            this.gameFinished = true;
            this.currentLevel = null;
            this.timer.reset();
            this.draw();
        }
    }

    onLevelComplete() {
        this.timer.pause();
        this.rightPosition.play();
        this.nextLevelButton = new Button(850, 540, 140, 50, 'Siguiente nivel', 'rgba(132, 233, 221, 1)');
        this.draw();
    }

    returnToMenu() {
        this.gameFinished = false;
        this.currentLevel = null;
        this.nextLevelButton = null;
        this.currentDifficultyIndex = 0;
        
        // Hide game container
        const gameContainer = document.getElementById('GameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
        
        // Show menu
        const menuElement = document.getElementById('blocka-menu');
        if (menuElement) {
            menuElement.style.display = 'flex';
        }
        
        this.timer.reset();
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw menu button
        if (this.menuButton) {
            this.menuButton.draw(this.ctx);
        }
        
        // Draw level indicator
        const gridSize = ImageLoader.getGridSize(this.currentGridSizeIndex);
        this.ctx.save();
        this.ctx.font = '24px Poppins, Helvetica';
        this.ctx.fillStyle = 'rgba(153, 223, 238, 1)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Level ${this.currentDifficultyIndex + 1}: ${this.difficulties[this.currentDifficultyIndex]} (${gridSize}x${gridSize})`,
            this.canvas.width / 2,
            50
        );
        this.ctx.stroke();
        this.ctx.restore();
        
        // Level complete state
        if (this.currentLevel && this.currentLevel.isCompleted()) {
            const completed = this.currentLevel.getCompletedImage();
            this.ctx.drawImage(
                completed.image,
                completed.x,
                completed.y,
                completed.width,
                completed.height
            );
            
            this.ctx.save();
            this.ctx.font = '40px Poppins, Helvetica';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 Level Complete!', this.canvas.width / 5, 120);
            this.ctx.restore();
            
            if (this.nextLevelButton) {
                this.nextLevelButton.draw(this.ctx);
            }
            return;
        }
        
        // Game finished state
        if (this.gameFinished) {
            if (this.currentImage) {
                // Draw the final completed image
                this.ctx.drawImage(
                    this.currentImage,
                    400, // offsetX
                    100, // offsetY
                    400, // width (2 pieces)
                    400  // height (2 pieces)
                );
            }
            
            this.ctx.save();
            this.ctx.font = '40px Poppins, Helvetica';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 Congratulations!!', this.canvas.width / 5, 120);
            this.ctx.fillText('All levels completed!', this.canvas.width / 5.2, 190);
            this.ctx.font = '20px Poppins, Helvetica';
            this.ctx.fillText('Return to MENU to play again!', this.canvas.width / 5.2, 260);
            this.ctx.restore();
            return;
        }

        // Draw current level - CON VERIFICACIÓN
        if (this.currentLevel) {
            console.log('Drawing level, type:', typeof this.currentLevel.draw); // DEBUG
            if (typeof this.currentLevel.draw === 'function') {
                this.currentLevel.draw(this.ctx);
            } else {
                console.error('currentLevel.draw is not a function!', this.currentLevel);
            }
        }
    }
}