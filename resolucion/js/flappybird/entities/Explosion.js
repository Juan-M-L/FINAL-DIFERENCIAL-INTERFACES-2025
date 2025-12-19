
// Explosion - Entidad de efecto visual de explosión.
// Animación que se reproduce una vez y luego se elimina.

export class Explosion {
  constructor(centerX, centerY, assetManager) {
    // Configuración del sprite.
    this.spriteConfig = {
      frameWidth: 300,
      frameHeight: 300,
      gapBetweenFrames: 0,
      framesPerRow: 22,
      animationSpeed: 2,
      totalFrames: 22
    };
    
    // Tamaño del efecto.
    this.width = 600;
    this.height = 600;
    
    // Posición centrada en el punto de explosión.
    this.x = Math.round(centerX - this.width / 2);
    this.y = Math.round(centerY - this.height / 2);
    
    // Animación.
    this.currentFrame = 0;
    this.frameCounter = 0;
    
    // Estado.
    this.finished = false;
    
    this.assetManager = assetManager;
  }

  // Actualiza la explosión. (solo animación)

  update(dt) {
    if (this.finished) return;
    
    this.frameCounter++;
    
    // Cambiar al siguiente frame.
    if (this.frameCounter >= this.spriteConfig.animationSpeed) {
      this.frameCounter = 0;
      this.currentFrame++;
      
      // Verificar si terminó la animación.
      if (this.currentFrame >= this.spriteConfig.totalFrames) {
        this.finished = true;
      }
    }
  }

  // Verifica si la animación terminó.
  isFinished() {
    return this.finished;
  }

  // Reinicia la explosión.
  reset(centerX, centerY) {
    this.x = Math.round(centerX - this.width / 2);
    this.y = Math.round(centerY - this.height / 2);
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.finished = false;
  }

  // Obtiene el progreso de la animación. (0-1)
  getProgress() {
    return this.currentFrame / this.spriteConfig.totalFrames;
  }


  // Obtiene el centro de la explosión.
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  // Obtiene el estado de la explosión.
  getState() {
    return {
      x: this.x,
      y: this.y,
      currentFrame: this.currentFrame,
      progress: this.getProgress(),
      finished: this.finished
    };
  }

  // Debug: Obtiene información de la explosión.
  getDebugInfo() {
    return {
      x: Math.round(this.x),
      y: Math.round(this.y),
      frame: this.currentFrame,
      totalFrames: this.spriteConfig.totalFrames,
      progress: `${Math.round(this.getProgress() * 100)}%`,
      finished: this.finished
    };
  }
}

// ExplosionPool - Pool de explosiones reutilizables.

export class ExplosionPool {
  constructor(assetManager, initialSize = 5) {
    this.assetManager = assetManager;
    this.pool = [];
    this.active = [];
    
    // Crear pool inicial.
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new Explosion(0, 0, assetManager));
    }
  }

  // Obtiene una explosión del pool o crea una nueva.
  get(centerX, centerY) {
    let explosion;
    
    if (this.pool.length > 0) {
      // Reutilizar explosión del pool.
      explosion = this.pool.pop();
      explosion.reset(centerX, centerY);
    } else {
      // Crear nueva si el pool está vacío.
      explosion = new Explosion(centerX, centerY, this.assetManager);
    }
    
    this.active.push(explosion);
    return explosion;
  }

  // Actualiza todas las explosiones activas.
  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const explosion = this.active[i];
      explosion.update(dt);
      
      // Si terminó, devolverla al pool.
      if (explosion.isFinished()) {
        this.active.splice(i, 1);
        this.pool.push(explosion);
      }
    }
  }

  // Obtiene todas las explosiones activas.
  getActive() {
    return this.active;
  }

  // Limpia todas las explosiones activas.
  clear() {
    // Devolver todas las activas al pool.
    this.pool.push(...this.active);
    this.active = [];
  }

  // Obtiene estadísticas del pool.
  getStats() {
    return {
      active: this.active.length,
      pooled: this.pool.length,
      total: this.active.length + this.pool.length
    };
  }
}