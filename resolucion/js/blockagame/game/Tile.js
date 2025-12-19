import ImageFilters from '../utils/ImageFilters.js';

export default class Tile {
    constructor(index, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
        this.angle = 0;
        this.filter = null;
    }

    setAngle(angle) {
        this.angle = angle % 360;
    }

    rotateLeft() {
        this.angle = (this.angle - 90 + 360) % 360;
    }

    rotateRight() {
        this.angle = (this.angle + 90) % 360;
    }

    isCorrect() {
        return this.angle % 360 === 0;
    }

    isPointInside(mx, my) {
        return mx >= this.x && 
               mx <= this.x + this.width && 
               my >= this.y && 
               my <= this.y + this.height;
    }

    setFilter(filterType) {
        this.filter = filterType;
    }

    draw(ctx, img) {
        ctx.save();
        
        // Move to center of tile
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((this.angle * Math.PI) / 180);

        // Apply filter if specified
        let drawImage = img;
        if (this.filter) {
            const filtered = ImageFilters.applyFilter(
                img, 
                this.sourceX, 
                this.sourceY, 
                this.sourceWidth, 
                this.sourceHeight, 
                this.filter
            );
            if (filtered) {
                drawImage = filtered;
                ctx.drawImage(drawImage, -this.width / 2, -this.height / 2, this.width, this.height);
            } else {
                ctx.drawImage(
                    img, 
                    this.sourceX, 
                    this.sourceY, 
                    this.sourceWidth, 
                    this.sourceHeight,
                    -this.width / 2, 
                    -this.height / 2, 
                    this.width, 
                    this.height
                );
            }
        } else {
            ctx.drawImage(
                img, 
                this.sourceX, 
                this.sourceY, 
                this.sourceWidth, 
                this.sourceHeight,
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        }

        ctx.restore();
    }
}