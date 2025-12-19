// game/Ficha.js
// Clases para las fichas del juego

class Ficha {
    constructor() {
        this.imagen = null;
    }

    updatePath(newPath) {
        this.path = newPath;
        this.imagen.src = this.getImagePath();
    }

    getImagePath() {
        return '';
    }

    render(ctx, x, y, size) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        const radius = size * 0.35;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        if (this.imagen && this.imagen.complete) {
            ctx.drawImage(this.imagen, cx - radius, cy - radius, radius * 2, radius * 2);
        } else if (this.imagen) {
            this.imagen.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(this.imagen, cx - radius, cy - radius, radius * 2, radius * 2);
                ctx.restore();
            };
        } else {
            // Fallback color si falla la imagen
            ctx.fillStyle = 'rgba(132, 233, 221, 1)';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.restore();
    }
}

class FichaAzul extends Ficha {
    constructor(boardStyle) {
        super();
        this.imagen = new Image();
        this.imagen.src = boardStyle.FICHA_AZUL;
    }

    getImagePath() {
        return this.imagen.src;
    }
}

class FichaRoja extends Ficha {
    constructor(boardStyle) {
        super();
        this.imagen = new Image();
        this.imagen.src = boardStyle.FICHA_ROJA;
    }

    getImagePath() {
        return this.imagen.src;
    }
}

class FichaVioleta extends Ficha {
    constructor(boardStyle) {
        super();
        this.imagen = new Image();
        this.imagen.src = boardStyle.FICHA_VIOLETA;
    }

    getImagePath() {
        return this.imagen.src;
    }
}