// scenes/GameOverScene.js
// Escena de fin de juego

class GameOverScene extends Scene {
    constructor() {
        super();
        this.gameMenu = document.getElementById('pegsolitaire-menu');
        this.gameContainer = document.getElementById('GameContainer');
        this.gameData = null;
    }

    init(gameData) {
        super.init();
        this.gameData = gameData || { won: false, fichas: 0 };

        // Mostrar mensaje apropiado
        if (this.gameData.timeout) {
            alert('¡Tiempo terminado! Te quedaron ' + this.gameData.fichas + ' fichas.');
        } else if (this.gameData.won) {
            alert('¡Felicidades! ¡Has ganado! Tiempo: ' + this.gameData.time);
        } else {
            alert('Juego terminado. Te quedaron ' + this.gameData.fichas + ' fichas. ¡Intenta de nuevo!');
        }

        // Volver al menú
        if (this.gameMenu) this.gameMenu.style.display = 'block';
        if (this.gameContainer) this.gameContainer.style.display = 'none';
        
        // Cambiar automáticamente al menú
        setTimeout(() => {
            if (this.sceneManager) {
                this.sceneManager.switchTo('menu');
            }
        }, 100);
    }

    render(ctx) {
        // Limpiar canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    cleanup() {
        super.cleanup();
        this.gameData = null;
    }
}