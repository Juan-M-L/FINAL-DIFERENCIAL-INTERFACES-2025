import { AssetManager } from './managers/AssetManager.js';
import { ScoreManager } from './managers/ScoreManager.js';
import { ParallaxManager } from './managers/ParallaxManager.js';
import { InputSystem } from './systems/InputSystem.js';
import { PhysicsSystem } from './systems/PhysicsSystem.js';
import { RenderSystem } from './systems/RenderSystem.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { Dragon } from './entities/Dragon.js';
import { Pipe } from './entities/Pipe.js';
import { Coin } from './entities/Coin.js';
import { IncreaseSizeCollectible } from './entities/IncreaseSizeCollectible.js';
import { DecreasePipeGapCollectible } from './entities/DecreasePipeGapCollectible.js';
import { Explosion } from './entities/Explosion.js';

// Clase principal del juego que coordina todos los sistemas
// y maneja el gameloop.
export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Estado del juego.
    this.state = {
      started: false,
      gameOver: false,
      paused: false
    };

    // Managers.
    this.assetManager = new AssetManager();
    this.scoreManager = new ScoreManager();
    this.parallaxManager = null; // Se inicializa después de cargar assets.

    // Systems.
    this.inputSystem = new InputSystem(canvas);
    this.physicsSystem = new PhysicsSystem(canvas);
    this.renderSystem = new RenderSystem(ctx, canvas);
    this.audioSystem = new AudioSystem();

    // Entidades.
    this.dragon = null;
    this.pipes = [];
    this.coins = [];
    this.collectibles = [];
    this.explosions = [];

    // Configuración del juego.
    this.config = {
      baseObjectGap: 200,
      currentObjectGap: 200,
      objectSpeed: 2,
      pipeSpawnInterval: 110, // frames
      coinSpawnChance: 0.3,
      increaseSizeSpawnChance: 0.1,
      decreasePipeGapCollectibleSpawnChance: 0.1,
      gravity: 0.5,
      jumpForce: -8
    };

    // Gameloop.
    this.animationId = null;
    this.lastTime = 0;
    this.frameCount = 0;
    this.deltaTime = 0;
    this.fps = 60;
    this.frameDuration = 1000 / this.fps;
    this.accumulator = 0;

    // Bind methods.
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  // Inicializa el juego. (carga assets, configura entidades)
  async init() {
    console.log('Iniciando carga de assets...');

    // Cargar todos los assets.
    await this.assetManager.loadAll();

    console.log('Assets cargados correctamente');

    // Inicializar parallax manager.
    this.parallaxManager = new ParallaxManager(
      this.ctx,
      this.canvas,
      this.assetManager
    );
    await this.parallaxManager.init();

    // Inicializar audio system.
    this.audioSystem.init(this.assetManager);

    // Crear el dragón.
    this.dragon = new Dragon(50, 150, this.assetManager);

    // Configurar input callbacks.
    this.inputSystem.onJump = this.handleInput;

    console.log('Juego inicializado');
  }

  // Inicia el gameloop.
  start() {
    if (this.animationId) return;
    
    this.lastTime = performance.now();
    this.state.started = false;
    this.state.gameOver = false;
    
    this.inputSystem.enable();
    this.gameLoop(this.lastTime);
    
    console.log('Gameloop iniciado');
  }

  // Detiene el gameloop.
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.inputSystem.disable();
    console.log('Gameloop detenido');
  }

  // Reinicia el juego.
  reset() {
    // Reiniciar estado.
    this.state.started = false;
    this.state.gameOver = false;
    this.frameCount = 0;
    this.config.currentObjectGap = this.config.baseObjectGap;
    
    // Reiniciar dragón.
    this.dragon.reset(50, 150);

    // Limpiar entidades.
    this.pipes = [];
    this.coins = [];
    this.collectibles = [];
    this.explosions = [];

    // Reiniciar parallax.
    this.parallaxManager.reset();

    // Reiniciar score.
    this.scoreManager.resetScore();

    console.log('Juego reiniciado');
  }

  //Maneja el input del jugador.
  handleInput() {
    if (!this.state.started) {
      this.state.started = true;
      this.parallaxManager.start();
    }

    if (this.state.gameOver) {
      this.reset();
      return;
    }

    // Hacer que el dragón salte.
    this.dragon.jump(this.config.jumpForce);
    this.audioSystem.playJump();
  }

  // Gameloop principal usando fixed timestep.
  gameLoop(currentTime) {
    this.animationId = requestAnimationFrame(this.gameLoop);

    // Calcular deltaTime en segundos.
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Limitar deltaTime para evitar spiral of death. (El deltatime crece sin control ante el menor delay del sistema)
    if (this.deltaTime > 0.1) this.deltaTime = 0.1;

    // Acumular tiempo.
    this.accumulator += this.deltaTime * 1000;

    // Update con fixed timestep.
    while (this.accumulator >= this.frameDuration) {
      this.update(this.frameDuration / 1000); // convertir a segundos
      this.accumulator -= this.frameDuration;
      this.frameCount++;
    }

    // Render siempre.
    this.render();
  }

  // Actualiza la lógica del juego.
  update(dt) {
    if (this.state.paused) return;

    // Actualizar parallax.
    if (this.state.started) {
      this.parallaxManager.update(dt);
    }

    if (!this.state.started || this.state.gameOver) {
      return;
    }

    // Actualizar dragón. (física y animación)
    this.dragon.update(dt, this.config.gravity);

    // Spawn pipes.
    if (this.frameCount % this.config.pipeSpawnInterval === 0) {
      this.spawnPipe();
    }

    // Spawn coins.
    if (this.frameCount % this.config.pipeSpawnInterval === 0) {
      this.spawnCoin();
    }

    // Spawn powerups.
    if (this.frameCount % this.config.pipeSpawnInterval === 60) {
      if (Math.random() > 0.5) {
        this.spawnIncreaseSizeCollectible();
      } else {
        this.spawnDecreasePipeGapCollectible();
      }
    }

    // Actualizar pipes.
    this.updatePipes(dt);

    // Actualizar coins.
    this.updateCoins(dt);

    // Actualizar collectibles.
    this.updatecollectibles(dt);

    // Actualizar explosiones.
    this.updateExplosions(dt);

    // Verificar colisiones.
    this.checkCollisions();

    // Verificar límites de pantalla.
    this.checkBounds();
  }

  // Renderiza el juego.
  render() {
    // Limpiar canvas.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Renderizar parallax. (fondo)
    this.parallaxManager.render();

    // Pantalla de inicio.
    if (!this.state.started && !this.state.gameOver) {
      this.renderStartScreen();
      this.renderSystem.drawEntity(this.dragon, this.assetManager.images.dragon);
      return;
    }

    // Renderizar entidades.
    this.pipes.forEach(pipe => {
      this.renderSystem.drawPipe(pipe, this.assetManager.images);
    });

    this.coins.forEach(coin => {
      this.renderSystem.drawEntity(coin, this.assetManager.images.coin);
    });

    this.collectibles.forEach(collectible => {
      if (collectible instanceof IncreaseSizeCollectible) {
        this.renderSystem.drawEntity(collectible, this.assetManager.images.increasesize);
      } else if (collectible instanceof DecreasePipeGapCollectible) {
        this.renderSystem.drawEntity(collectible, this.assetManager.images.decreasepipegap);
      }
    });

    this.explosions.forEach(explosion => {
      this.renderSystem.drawEntity(explosion, this.assetManager.images.explosion);
    });

    this.renderSystem.drawEntity(this.dragon, this.assetManager.images.dragon);

    // Renderizar Interfaz de Usuario.
    this.renderUI();

    // Game Over.
    if (this.state.gameOver) {
      this.renderGameOverScreen();
    }
  }

  // Spawn de tubería.
  spawnPipe() {
    const top = Math.random() * (this.canvas.height - this.config.currentObjectGap - 140) + 40;
    const pipe = new Pipe(
      this.canvas.width,
      top,
      this.config.currentObjectGap
    );
    this.pipes.push(pipe);
  }

  // Spawn de moneda.
  spawnCoin() {
    if (Math.random() <= this.config.coinSpawnChance && this.pipes.length > 0) {
      const lastPipe = this.pipes[this.pipes.length - 1];
      const coinY = lastPipe.top + (this.config.currentObjectGap / 2) - 15;
      const coin = new Coin(
        this.canvas.width + 12,
        coinY,
        this.assetManager
      );
      this.coins.push(coin);
    }
  }

  spawnIncreaseSizeCollectible() {
    if (Math.random() <= this.config.increaseSizeSpawnChance && this.pipes.length > 0) {
      const lastPipe = this.pipes[this.pipes.length - 1];
      const increasesizeY = lastPipe.top + (this.config.currentObjectGap / 2) - 15;
      const increasesize = new IncreaseSizeCollectible(
        this.canvas.width + 12,
        increasesizeY,
        this.assetManager
      );
      this.collectibles.push(increasesize);
    }
  }

  spawnDecreasePipeGapCollectible() {
    if (Math.random() <= this.config.decreasePipeGapCollectibleSpawnChance && this.pipes.length > 0) {
      const lastPipe = this.pipes[this.pipes.length - 1];
      const decreasePipeGapCollectibleY = lastPipe.top + (this.config.currentObjectGap / 2) - 15;
      const decreasePipeGapCollectible = new DecreasePipeGapCollectible(
        this.canvas.width + 12,
        decreasePipeGapCollectibleY,
        this.assetManager
      );
      this.collectibles.push(decreasePipeGapCollectible);
    }
  }

  // Actualiza pipes.
  updatePipes(dt) {
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update(dt, this.config.objectSpeed);

      // Verificar si pasó el dragón (para puntaje).
      if (pipe.x + pipe.width < this.dragon.x && !pipe.passed) {
        pipe.passed = true;
        this.scoreManager.addPoint();
        this.audioSystem.playPoint();
      }

      // Eliminar si salió de pantalla.
      if (pipe.x + pipe.width < 0) {
        this.pipes.splice(i, 1);
      }
    }
  }

  // Actualiza monedas.
  updateCoins(dt) {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.update(dt, this.config.objectSpeed);

      // Eliminar si salió de pantalla.
      if (coin.x + coin.width < 0) {
        this.coins.splice(i, 1);
      }
    }
  }

  // Actualiza incresesizes.
  updatecollectibles(dt) {
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      collectible.update(dt, this.config.objectSpeed);

      // Eliminar si salió de pantalla.
      if (collectible.x + collectible.width < 0) {
        this.collectibles.splice(i, 1);
      }
    }
  }

  // Actualiza explosiones.
  updateExplosions(dt) {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.update(dt);

      if (explosion.isFinished()) {
        this.explosions.splice(i, 1);
      }
    }
  }

  // Verifica colisiones.
  checkCollisions() {
    // Colisión con pipes.
    for (const pipe of this.pipes) {
      if (this.physicsSystem.checkCollision(this.dragon, pipe)) {
        this.handleCollision();
        return;
      }
    }

    // Colisión con coins.
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      if (this.physicsSystem.checkCollisionWithCollectible(this.dragon, coin)) {
        this.scoreManager.addPoint();
        this.audioSystem.playPoint();
        this.coins.splice(i, 1);
      }
    }

    // Colisión con collectible.
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      if (this.physicsSystem.checkCollisionWithCollectible(this.dragon, collectible)) {
        if (collectible instanceof IncreaseSizeCollectible) {
          this.dragon.width = this.dragon.width + 10;
          this.dragon.height = this.dragon.height + 10;
        } else if (collectible instanceof DecreasePipeGapCollectible) {
          this.config.currentObjectGap = this.config.currentObjectGap - 100;
        }
        this.audioSystem.playPoint();
        this.collectibles.splice(i, 1);
      }
    }
  }

  // Verifica límites del canvas.
  checkBounds() {
    if (this.dragon.y + this.dragon.height > this.canvas.height || this.dragon.y < 0) {
      this.handleCollision();
    }
  }

  // Maneja una colisión. (game over)
  handleCollision() {
    this.state.gameOver = true;
    this.parallaxManager.stop();
    this.audioSystem.playHit();
    
    // Crear explosión.
    const explosion = new Explosion(
      this.dragon.x + this.dragon.width / 2,
      this.dragon.y + this.dragon.height / 2,
      this.assetManager
    );
    this.explosions.push(explosion);
  }

  //Renderiza la pantalla de inicio.
  renderStartScreen() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(0, this.canvas.height / 2 - 40, this.canvas.width, 80);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'Presiona cualquier tecla o click para comenzar',
      this.canvas.width / 2,
      this.canvas.height / 2 + 8
    );
  }

  //Renderiza la UI. (puntaje)
  renderUI() {
    const { score, highScore } = this.scoreManager;
    
    this.ctx.fillStyle = 'rgba(0,0,0,0.35)';
    this.ctx.fillRect(10, 10, 160, 60);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Puntaje: ' + score, 20, 34);
    this.ctx.fillText('Máximo: ' + highScore, 20, 58);
  }

  // Renderiza la pantalla de game over.
  renderGameOverScreen() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(0, this.canvas.height / 2 - 70, this.canvas.width, 140);
    this.ctx.fillStyle = 'red';
    this.ctx.font = '42px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('¡Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 8);
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      'Presiona cualquier tecla o click para reiniciar',
      this.canvas.width / 2,
      this.canvas.height / 2 + 28
    );
  }
}