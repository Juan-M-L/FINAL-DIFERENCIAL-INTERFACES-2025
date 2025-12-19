// Pipe - Entidad de tubería. (obstáculo)
// Representa un par de tuberías (superior e inferior) con un gap entre ellas.
export class Pipe {
  constructor(x, top, gap) {
    // Posición.
    this.x = x;
    this.top = top;           // Altura de la tubería superior.
    this.bottom = top + gap;  // Inicio de la tubería inferior.
    this.gap = gap;
    
    // Dimensiones.
    this.width = 60;
    
    // Estado.
    this.passed = false; // Si el jugador ya pasó esta tubería.
    this.scored = false; // Si ya sumó punto. (evita puntos duplicados)
  }

  // Actualiza la tubería. (movimiento horizontal)
  update(dt, speed) {
    this.x -= speed;
  }

  // Verifica si la tubería salió completamente de la pantalla.
  isOffScreen() {
    return this.x + this.width < 0;
  }

  // Verifica si el jugador pasó esta tubería
  isPassed(dragonX) {
    return this.x + this.width < dragonX;
  }

  // Marca la tubería como pasada y retorna si debe sumar punto.
  checkPassed(dragonX) {
    if (!this.passed && this.isPassed(dragonX)) {
      this.passed = true;
      if (!this.scored) {
        this.scored = true;
        return true;
      }
    }
    return false;
  }

  // Obtiene los bounds de la tubería superior.
  getTopBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: 0,
      bottom: this.top
    };
  }

  // Obtiene los bounds de la tubería inferior.
  getBottomBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.bottom,
      bottom: 60 // Hasta el fondo del canvas.
    };
  }

  // Obtiene los bounds completos. (para optimización de colisiones)
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      topHeight: this.top,
      bottomStart: this.bottom
    };
  }

  // Verifica si la tubería está visible en pantalla.
  isVisible(canvasWidth) {
    return this.x + this.width > 0 && this.x < canvasWidth;
  }

  
  // Obtiene la posición del centro del gap. (útil para spawn de coins)
  getGapCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.top + this.gap / 2
    };
  }

  // Obtiene el estado de la tubería.
  getState() {
    return {
      x: this.x,
      top: this.top,
      bottom: this.bottom,
      passed: this.passed,
      scored: this.scored
    };
  }

  
  // Debug: Obtiene información de la tubería.
  getDebugInfo() {
    return {
      x: Math.round(this.x),
      top: this.top,
      bottom: this.bottom,
      gap: this.gap,
      passed: this.passed,
      scored: this.scored
    };
  }
}