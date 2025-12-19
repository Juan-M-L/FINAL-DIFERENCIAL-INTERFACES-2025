
// Coin - Entidad de moneda recolectable.
// Moneda animada que el jugador puede juntar por puntos extra.
export class Coin {
    constructor(x, y, assetManager) {
        // Posición y tamaño.
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;

        // Animación.
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.animationDirection = 1; // 1 = adelante, -1 = atrás

        // Configuración del sprite.
        this.spriteConfig = {
            frameWidth: 200,
            frameHeight: 250,
            gapBetweenFrames: 0,
            framesPerRow: 6,
            animationSpeed: 4,
            totalFrames: 6
        };

        // Estado.
        this.collected = false;

        this.assetManager = assetManager;
    }

    // Actualiza la moneda. (movimiento y animación)
    update(dt, speed) {
        // Mover horizontalmente.
        this.x -= speed;

        // Actualizar animación.
        this.updateAnimation();
    }

    // Actualiza la animación de la moneda.
    // Animación ping-pong: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 4 -> 3 -> 2 -> 1 -> 0
    updateAnimation() {
        this.frameCounter++;

        if (this.frameCounter >= this.spriteConfig.animationSpeed) {
            this.frameCounter = 0;

            // Actualizar frame según la dirección.
            this.currentFrame += this.animationDirection;

            // Si llegamos al frame 5, cambiar dirección a reversa.
            if (this.currentFrame >= 5 && this.animationDirection === 1) {
                this.animationDirection = -1;
            }

            // Si volvimos al frame 0, cambiar dirección a adelante.
            if (this.currentFrame <= 0 && this.animationDirection === -1) {
                this.animationDirection = 1;
            }
        }
    }

    // Marca la moneda como juntada.
    collect() {
        this.collected = true;
    }

    // Verifica si la moneda fue juntada.
    isCollected() {
        return this.collected;
    }

    // Verifica si la moneda salió de la pantalla.
    isOffScreen() {
        return this.x + this.width < 0;
    }

    // Obtiene el centro de la moneda.
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

    // Verifica si la moneda está visible en pantalla.
    isVisible(canvasWidth) {
        return this.x + this.width > 0 && this.x < canvasWidth;
    }

    // Obtiene el radio de colisión. (para colisión circular)
    getCollisionRadius() {
        return Math.min(this.width, this.height) / 2;
    }

    // Obtiene el estado de la moneda.
    getState() {
        return {
            x: this.x,
            y: this.y,
            currentFrame: this.currentFrame,
            collected: this.collected
        };
    }

    // Debug: Obtiene información de la moneda.
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