
// Dragon - Entidad del jugador.
// Maneja posición, física, y animación del dragón.
export class Dragon {
  constructor(x, y, assetManager) {
    // Posición y tamaño.
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    
    // Física.
    this.velocity = 0;
    this.gravity = 0.5; // Se aplicará desde el PhysicsSystem.
    this.lift = -8;     // Fuerza del salto.
    
    // Animación.
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.isAnimating = false;
    this.animationDirection = 1; // 1 = adelante, -1 = atrás
    
    // Configuración del sprite.
    this.spriteConfig = {
      frameWidth: 200,
      frameHeight: 150,
      gapBetweenFrames: 10,
      framesPerRow: 3,
      animationSpeed: 4, // Frames del juego por frame de animación.
      totalFrames: 3     // Total de frames en la animación.
    };
    
    this.assetManager = assetManager;
  }

  // Actualiza el dragón. (física y animación)
  update(dt, gravity) {
    // Aplicar gravedad.
    this.velocity += gravity;
    this.y += this.velocity;
    
    // Actualizar animación.
    this.updateAnimation();
  }

  // Hace que el dragón salte.
  jump(force) {
    this.velocity = force || this.lift;
    
    // Iniciar animación de aleteo.
    this.currentFrame = 0;
    this.isAnimating = true;
    this.animationDirection = 1;
    this.frameCounter = 0;
  }

  // Actualiza la animación del dragón.
  // Animación ping-pong: 0 -> 1 -> 2 -> 1 -> 0
  updateAnimation() {
    if (!this.isAnimating) return;
    
    this.frameCounter++;
    
    // Cambiar frame cuando llegue al umbral.
    if (this.frameCounter >= this.spriteConfig.animationSpeed) {
      this.frameCounter = 0;
      
      // Actualizar frame según la dirección.
      this.currentFrame += this.animationDirection;
      
      // Si llegamos al frame 2, cambiar dirección a reversa.
      if (this.currentFrame >= 2 && this.animationDirection === 1) {
        this.animationDirection = -1;
      }
      
      // Si volvimos al frame 0, terminar la animación.
      if (this.currentFrame <= 0 && this.animationDirection === -1) {
        this.currentFrame = 0;
        this.isAnimating = false;
        this.animationDirection = 1;
      }
    }
  }

  // Reinicia el dragón a su estado inicial.
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.velocity = 0;
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.isAnimating = false;
    this.animationDirection = 1;
  }

  // Obtiene el centro del dragón. (útil para explosiones)
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  // Obtiene el bounding box para colisiones.
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  // Verifica si el dragón está cayendo.
  isFalling() {
    return this.velocity > 0;
  }

  // Verifica si el dragón está subiendo.
  isRising() {
    return this.velocity < 0;
  }

  // Establece la velocidad directamente. (útil para efectos especiales)
  setVelocity(velocity) {
    this.velocity = velocity;
  }

  // Obtiene el estado actual del dragón.
  getState() {
    return {
      x: this.x,
      y: this.y,
      velocity: this.velocity,
      isAnimating: this.isAnimating,
      currentFrame: this.currentFrame
    };
  }
}