export default class Button {
    constructor(x, y, width, height, text, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.baseColor = color || 'rgba(210, 113, 243, 1)';
        this.hover = false;
        this.pressed = false;
        this.radius = 12;
        this.textColor = 'rgba(255, 255, 255, 1)';
        this.onClick = null;
    }

    isPointInside(mx, my) {
        return mx >= this.x && 
               mx <= this.x + this.width && 
               my >= this.y && 
               my <= this.y + this.height;
    }

    drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    draw(ctx) {
        ctx.save();

        // Shadow
        ctx.shadowColor = 'rgba(252, 75, 255, 0.35)';
        ctx.shadowBlur = this.hover || this.pressed ? 20 : 10;
        ctx.shadowOffsetY = this.pressed ? 2 : 6;

        // Gradient background
        const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        grad.addColorStop(0, this.baseColor);
        grad.addColorStop(1, 'rgba(249, 243, 250, 0.08)');

        // State-based coloring
        if (this.pressed) {
            ctx.fillStyle = 'rgba(235, 138, 213, 1)';
        } else if (this.hover) {
            ctx.fillStyle = 'rgba(172, 114, 238, 1)';
        } else {
            ctx.fillStyle = grad;
        }

        // Draw rounded rect
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        ctx.fill();

        // Outline
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.stroke();

        // Text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = this.textColor;
        ctx.font = '20px Poppins, Helvetica';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tx = this.x + this.width / 2;
        const ty = this.y + this.height / 2;
        ctx.fillText(this.text, tx, ty);

        ctx.restore();
    }

    handleClick(mouseX, mouseY) {
        if (this.isPointInside(mouseX, mouseY)) {
            if (this.onClick) {
                this.onClick();
            }
            return true;
        }
        return false;
    }

    setOnClick(callback) {
        this.onClick = callback;
    }
}