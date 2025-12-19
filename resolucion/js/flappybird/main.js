import { Game } from './game.js';

//Punto de entrada principal del juego Flappy Bird.
//Maneja la inicialización y la interfaz del menú.

class FlappyBirdApp {
  constructor() {
    this.game = null;
    this.canvas = null;
    this.ctx = null;
    
    // Referencias a elementos del DOM
    this.playBtn = null;
    this.gameMenu = null;
    this.gameContainer = null;
  }

  //Inicializa la aplicación.
  async init() {
    try {
      // Obtener elementos del DOM.
      this.canvas = document.getElementById('flappybird-canvas');
      if (!this.canvas) {
        console.error('Canvas no encontrado');
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.playBtn = document.getElementById('flappybird-play-btn');
      this.gameMenu = document.getElementById('flappybird-menu');
      this.gameContainer = document.getElementById('GameContainer');

      // Configurar canvas.
      this.setupCanvas();

      // Crear instancia del juego.
      this.game = new Game(this.canvas, this.ctx);

      // Configurar controles del menú.
      this.setupMenuControls();

      console.log('FlappyBird inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar FlappyBird:', error);
    }
  }

  //Configura las dimensiones y propiedades del canvas.
  setupCanvas() {
    this.canvas.width = this.canvas.width || 1000;
    this.canvas.height = this.canvas.height || 600;
    this.canvas.style.display = 'block';
    
    // Deshabilitar suavizado para pixel art.
    this.ctx.imageSmoothingEnabled = false;
  }

  // Configura los controles del menú.
  setupMenuControls() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.startGame());
    } else {
      // Si no hay botón de play, iniciar automáticamente
      this.startGame();
    }
  }

  // Inicia el juego.
  async startGame() {
    try {
      // Ocultar menú y mostrar contenedor del juego
      if (this.gameMenu) this.gameMenu.style.display = 'none';
      if (this.gameContainer) this.gameContainer.style.display = 'flex';

      // Inicializar el juego (carga assets, etc.)
      await this.game.init();

      // Iniciar el gameloop
      this.game.start();

      console.log('Juego iniciado');
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
    }
  }

  // Detiene el juego.
  stopGame() {
    if (this.game) {
      this.game.stop();
    }
  }
}

// Inicializar cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
  const app = new FlappyBirdApp();
  app.init().catch(err => console.error('Error en inicialización:', err));
});