import { makeSprite, makeLayer, makeInfiniteScroll } from '../utils.js';


// ParallaxManager - Gestiona el efecto parallax del fondo.
export class ParallaxManager {
  constructor(ctx, canvas, assetManager) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.assetManager = assetManager;
    
    // Capas del parallax.
    this.layers = [];
    
    // Control de movimiento.
    this.isMoving = false;
    this.oldTime = 0;
    
    // Velocidades de cada capa. (píxeles por segundo)
    // Capas más lejanas se mueven más lento. (efecto de profundidad)
    this.speeds = {
      layer1: 0,      // Estática. (cielo)
      layer2: -50,    // Montañas lejanas. (lenta)
      layer3: -100,   // Montañas cercanas. (media)
      layer4: -150    // Árboles/terreno. (rápida)
    };
  }

  // Inicializa las capas del parallax.
  async init() {
    // Verificar que las imágenes estén cargadas.
    if (!this.assetManager.isLoaded()) {
      console.warn('Assets no cargados aún');
      return;
    }

    // Crear las capas escaladas al tamaño del canvas.
    this.createLayers();
    
    console.log('ParallaxManager inicializado');
  }

  // Crea las capas escaladas al canvas.
  createLayers() {
    const layer1Img = this.assetManager.getImage('layer1');
    const layer2Img = this.assetManager.getImage('layer2');
    const layer3Img = this.assetManager.getImage('layer3');
    const layer4Img = this.assetManager.getImage('layer4');

    // Calcular escala para que cada capa cubra la altura del canvas.
    const scale1 = this.canvas.height / layer1Img.height || 1;
    const scale2 = this.canvas.height / layer2Img.height || 1;
    const scale3 = this.canvas.height / layer3Img.height || 1;
    const scale4 = this.canvas.height / layer4Img.height || 1;

    // Layer 1: estática. (solo un sprite)
    this.layers.push({
      type: 'static',
      gameObj: makeSprite(this.ctx, layer1Img, { x: 0, y: 0 }, scale1),
      speed: this.speeds.layer1
    });

    // Layers 2-4: con scrolling infinito. (dos sprites que se alternan)
    this.layers.push({
      type: 'scrolling',
      gameObj: makeLayer(this.ctx, layer2Img, { x: 0, y: 0 }, scale2),
      speed: this.speeds.layer2,
      scale: scale2
    });

    this.layers.push({
      type: 'scrolling',
      gameObj: makeLayer(this.ctx, layer3Img, { x: 0, y: 0 }, scale3),
      speed: this.speeds.layer3,
      scale: scale3
    });

    this.layers.push({
      type: 'scrolling',
      gameObj: makeLayer(this.ctx, layer4Img, { x: 0, y: 0 }, scale4),
      speed: this.speeds.layer4,
      scale: scale4
    });
  }

  // Inicia el movimiento del parallax.
  start() {
    this.isMoving = true;
    this.oldTime = performance.now();
  }

  // Detiene el movimiento del parallax.
  stop() {
    this.isMoving = false;
  }

  // Reinicia el parallax a su posición inicial.
  reset() {
    this.isMoving = false;
    this.oldTime = 0;
    
    // Reiniciar posiciones de las capas.
    if (this.layers.length > 0) {
      this.createLayers();
    }
  }

  // Actualiza el parallax.
  update(dt) {
    if (!this.isMoving) return;
    
    // dt es calculado desde el gameloop!
  }

  // Renderiza todas las capas del parallax.
  render() {
    if (this.layers.length === 0) return;

    // Calcular deltaTime solo para parallax.
    const currentTime = performance.now();
    let dt = 0;
    
    if (this.isMoving && this.oldTime > 0) {
      dt = (currentTime - this.oldTime) / 1000; // convertir a segundos
    }
    
    this.oldTime = currentTime;

    // Renderizar cada capa.
    for (const layer of this.layers) {
      if (layer.type === 'static') {
        // Capa estática (solo dibujar)
        layer.gameObj.draw();
      } else if (layer.type === 'scrolling') {
        // Capa con scrolling infinito
        const speed = layer.speed * layer.scale;
        makeInfiniteScroll(dt, layer.gameObj, speed);
      }
    }
  }

  // Cambia la velocidad de todas las capas. (para efectos especiales)
  setSpeedMultiplier(multiplier) {
    this.speeds.layer2 = -50 * multiplier;
    this.speeds.layer3 = -100 * multiplier;
    this.speeds.layer4 = -150 * multiplier;
  }

  // Obtiene el estado actual.
  getState() {
    return {
      isMoving: this.isMoving,
      layerCount: this.layers.length
    };
  }


  // Pausa/reanuda el parallax.
  togglePause() {
    this.isMoving = !this.isMoving;
    if (this.isMoving) {
      this.oldTime = performance.now();
    }
  }
}