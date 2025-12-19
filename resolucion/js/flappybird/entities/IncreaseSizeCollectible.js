// IncreaseSizeCollectible - Entidad recolectable.
// Entidad animada que el jugador puede juntar para crecer de tamaño por unos segundos.
export class IncreaseSizeCollectible {
    constructor(x, y, assetManager) {
        // Posición y tamaño.
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;

        // Animación.
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.animationDirection = 1; // 1 = adelante, -1 = atrás

        // Configuración de sprite.
        this.spriteConfig = {
            frameWidth: 38,
            frameHeight: 40,
            gapBetweenFrames: 1,
            framesPerRow: 4,
            animationSpeed: 4,
            totalFrames: 4
        };

        // Estado.
        this.collected = false;
        
        this.assetManager = assetManager;
    }

    // Actualiza el recolectable. (movimiento y animación)
    update(dt, speed) {
        // Mover horizontalmente.
        this.x -= speed;

        // Actualizar animación.
        this.updateAnimation();
    }


    // Actualiza la animación del recolectable.
    // Animación ping-pong: 0 -> 1 -> 2 -> 3 -> 2 -> 1 -> 0
    updateAnimation() {
        this.frameCounter++;
        
        if (this.frameCounter >= this.spriteConfig.animationSpeed) {
            this.frameCounter = 0;
            
            // Actualizar frame según la dirección.
            this.currentFrame += this.animationDirection;
            
            // Si llegamos al frame 3, cambiar dirección a reversa.
            if (this.currentFrame >= 3 && this.animationDirection === 1) {
                this.animationDirection = -1;
            }
            
            // Si volvimos al frame 0, cambiar dirección a adelante.
            if (this.currentFrame <= 0 && this.animationDirection === -1) {
                this.animationDirection = 1;
            }
        }
    }

    // Marcar como juntado.
    collect() {
        this.collected = true;
    }

    // Verifica si fue juntado.
    isCollected() {
        return this.collected;
    }

    // Verifica si salió de la pantalla.
    isOffScreen() {
        return this.x + this.width < 0;
    }

    // Obtiene el centro del recolectable.
    getCenter() {
        return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
        };
    }

    // Obtiene los bounds para colisiones.
    getBounds() {
        return {
        left: this.x,
        right: this.x + this.width,
        top: this.y,
        bottom: this.y + this.height
        };
    }

    // Verifica si el recolectable está visible en pantalla.
    isVisible(canvasWidth) {
        return this.x + this.width > 0 && this.x < canvasWidth;
    }

    // Obtiene el radio de colisión. (para colisión circular)
    getCollisionRadius() {
        return Math.min(this.width, this.height) / 2;
    }

    // Obtiene el estado del recolectable.
    getState() {
        return {
        x: this.x,
        y: this.y,
        currentFrame: this.currentFrame,
        collected: this.collected
        };
    }

    // Debug: Obtiene información del recolectable.
    getDebugInfo() {
        return {
        x: Math.round(this.x),
        y: Math.round(this.y),
        frame: this.currentFrame,
        direction: this.animationDirection === 1 ? 'forward' : 'backward',
        collected: this.collected
        };
    }
}
