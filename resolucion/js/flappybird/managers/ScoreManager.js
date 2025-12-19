// ScoreManager - Gestiona los puntajes y records del juego.

export class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.storageKey = 'flappybird_highScore';
    
    // Cargar highScore desde localStorage.
    this.loadHighScore();
  }

  // Carga el highScore desde localStorage.
  loadHighScore() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.highScore = stored ? Number(stored) : 0;
      console.log(`HighScore cargado: ${this.highScore}`);
    } catch (error) {
      console.warn('Error al cargar highScore desde localStorage:', error);
      this.highScore = 0;
    }
  }

  // Guarda el highScore en localStorage.
  saveHighScore() {
    try {
      localStorage.setItem(this.storageKey, String(this.highScore));
      console.log(`HighScore guardado: ${this.highScore}`);
    } catch (error) {
      console.warn('Error al guardar highScore en localStorage:', error);
    }
  }

  // Añade un punto al puntaje actual.
  addPoint() {
    this.score++;
    
    // Verificar si es nuevo record.
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
      return true; // Indica que es nuevo record
    }
    
    return false;
  }

  // Añade múltiples puntos.
  addPoints(points) {
    this.score += points;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
      return true;
    }
    
    return false;
  }

  // Reinicia el puntaje actual. (no el highScore)
  resetScore() {
    this.score = 0;
  }

  // Reinicia el highScore. (útil para testing o reset total)
  resetHighScore() {
    this.highScore = 0;
    this.saveHighScore();
  }

  // Obtiene el puntaje actual.
  getScore() {
    return this.score;
  }

  // Obtiene el highScore.
  getHighScore() {
    return this.highScore;
  }

  // Verifica si el puntaje actual es un nuevo record.
  isNewRecord() {
    return this.score === this.highScore && this.score > 0;
  }

  // Obtiene estadísticas del juego.
  getStats() {
    return {
      score: this.score,
      highScore: this.highScore,
      isNewRecord: this.isNewRecord()
    };
  }
}