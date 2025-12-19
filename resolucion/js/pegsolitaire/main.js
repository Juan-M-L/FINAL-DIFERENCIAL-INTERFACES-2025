// main.js
// Punto de entrada principal del juego

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initPegSolitaire();
});

function initPegSolitaire() {
    // Obtener canvas y contexto
    const canvas = document.getElementById('pegsolitaire-canvas');
    if (!canvas) {
        console.error('Canvas no encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Configurar canvas con las dimensiones del CSS
    function resizeCanvas() {
        canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
    }
    resizeCanvas();

    // Crear gestor de escenas
    const sceneManager = new SceneManager();

    // Crear y agregar escenas
    sceneManager.add('menu', new MenuScene());
    sceneManager.add('game', new GameScene(canvas));
    sceneManager.add('gameover', new GameOverScene());

    // Iniciar en el menú
    sceneManager.switchTo('menu');

    // Game loop principal
    function gameLoop() {
        sceneManager.update();
        sceneManager.render(ctx);
        requestAnimationFrame(gameLoop);
    }

    // Iniciar game loop
    gameLoop();

    // Manejo de teclas (opcional)
    document.addEventListener('keydown', function(e) {
        sceneManager.handleKeyPress(e.key);
    });

    // Exponer para debugging (opcional)
    if (typeof window !== 'undefined') {
        window.pegSolitaireGame = {
            sceneManager: sceneManager,
            getScene: () => sceneManager.getCurrentScene()
        };
    }
}