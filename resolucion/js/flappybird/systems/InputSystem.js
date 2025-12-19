
// InputSystem - Maneja toda la entrada del usuario.
// (teclado, mouse, touch)
export class InputSystem {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Callbacks.
    this.onJump = null;
    
    // Estado.
    this.enabled = false;
    
    // Bind methods.
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }

  // Habilita el sistema de input.
  enable() {
    if (this.enabled) return;
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    
    this.enabled = true;
    console.log('InputSystem habilitado');
  }

  // Deshabilita el sistema de input.
  disable() {
    if (!this.enabled) return;
    
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    
    this.enabled = false;
    console.log('InputSystem deshabilitado');
  }

  // Maneja el evento de tecla presionada.
  handleKeyDown(e) {
    // Prevenir scroll con flechas.
    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
    }
    
    // Teclas válidas para saltar.
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
      e.preventDefault();
      this.triggerJump();
    }
  }

  // Maneja el evento de click del mouse.
  handleMouseDown(e) {
    e.preventDefault();
    this.triggerJump();
  }

  // Maneja el evento de toque en pantalla.
  handleTouchStart(e) {
    e.preventDefault();
    this.triggerJump();
  }

  // Ejecuta el callback de salto si está definido.
  triggerJump() {
    if (this.onJump && typeof this.onJump === 'function') {
      this.onJump();
    }
  }

  // Verifica si el sistema está habilitado.
  isEnabled() {
    return this.enabled;
  }

  // Limpia todos los event listeners. (útil para cleanup)
  destroy() {
    this.disable();
    this.onJump = null;
  }
}