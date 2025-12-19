// AudioSystem - Maneja la reproducción de sonidos y música.
export class AudioSystem {
  constructor() {
    this.sounds = {
      jump: null,
      hit: null,
      point: null
    };
    
    this.assetManager = null;
    
    // Configuración.
    this.enabled = true;
    this.volume = 1.0;
    this.soundPool = new Map(); // Pool de sonidos para reproducción simultánea.
  }

  // Inicializa el sistema con el AssetManager.
  init(assetManager) {
    this.assetManager = assetManager;
    
    // Obtener referencias a los sonidos.
    this.sounds.jump = assetManager.getSound('jump');
    this.sounds.hit = assetManager.getSound('hit');
    this.sounds.point = assetManager.getSound('point');
    
    // Configurar volumen inicial.
    this.setVolume(this.volume);
    
    console.log('AudioSystem inicializado');
  }

  // Reproduce un sonido.
  playSound(soundKey) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundKey];
    if (!sound) {
      console.warn(`Sonido no encontrado: ${soundKey}`);
      return;
    }

    try {
      // Reiniciar el sonido al inicio y reproducir.
      sound.currentTime = 0;
      sound.play().catch(err => {
        // Ignorar errores de reproducción. (puede ocurrir si el usuario no ha interactuado)
        console.warn(`Error al reproducir ${soundKey}:`, err.message);
      });
    } catch (error) {
      console.warn(`Error al reproducir ${soundKey}:`, error.message);
    }
  }

  // Reproduce el sonido de salto.
  playJump() {
    this.playSound('jump');
  }

  // Reproduce el sonido de colisión.
  playHit() {
    this.playSound('hit');
  }

  // Reproduce el sonido de punto.
  playPoint() {
    this.playSound('point');
  }

  // Reproduce un sonido con posibilidad de múltiples instancias simultáneas.
  // Útil si quieres que el mismo sonido se reproduzca varias veces al mismo tiempo.
  playSoundPooled(soundKey) {
    if (!this.enabled) return;
    if (!this.assetManager) return;

    try {
      // Clonar el sonido para reproducción simultánea
      const clonedSound = this.assetManager.cloneSound(soundKey);
      if (!clonedSound) return;

      clonedSound.volume = this.volume;
      clonedSound.play().catch(err => {
        console.warn(`Error al reproducir ${soundKey}:`, err.message);
      });
    } catch (error) {
      console.warn(`Error al reproducir ${soundKey}:`, error.message);
    }
  }

  // Detiene un sonido.
  stopSound(soundKey) {
    const sound = this.sounds[soundKey];
    if (!sound) return;

    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (error) {
      console.warn(`Error al detener ${soundKey}:`, error.message);
    }
  }

  // Detiene todos los sonidos.
  stopAll() {
    Object.keys(this.sounds).forEach(key => {
      this.stopSound(key);
    });
  }

  // Habilita el audio.
  enable() {
    this.enabled = true;
    console.log('Audio habilitado');
  }

  // Deshabilita el audio.
  disable() {
    this.enabled = false;
    this.stopAll();
    console.log('Audio deshabilitado');
  }

  // Alterna el audio. (on/off)
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopAll();
    }
    return this.enabled;
  }

  // Establece el volumen global. (0.0 - 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume)); // Clamp entre 0 y 1
    
    // Aplicar a todos los sonidos.
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.volume = this.volume;
      }
    });
  }

  // Obtiene el volumen actual.
  getVolume() {
    return this.volume;
  }

  // Incrementa el volumen.
  volumeUp(amount = 0.1) {
    this.setVolume(this.volume + amount);
  }

  // Decrementa el volumen.
  volumeDown(amount = 0.1) {
    this.setVolume(this.volume - amount);
  }

  // Silencia/desilencia. (mute/unmute)
  toggleMute() {
    if (this.volume > 0) {
      this.previousVolume = this.volume;
      this.setVolume(0);
    } else {
      this.setVolume(this.previousVolume || 0.5);
    }
  }

  // Verifica si el audio está habilitado.
  isEnabled() {
    return this.enabled;
  }

  // Verifica si está silenciado.
  isMuted() {
    return this.volume === 0;
  }

  // Obtiene el estado del sistema.
  getState() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      muted: this.isMuted()
    };
  }

  // Limpia el sistema. (útil para cleanup)
  destroy() {
    this.stopAll();
    this.sounds = {};
    this.soundPool.clear();
    this.assetManager = null;
  }
}