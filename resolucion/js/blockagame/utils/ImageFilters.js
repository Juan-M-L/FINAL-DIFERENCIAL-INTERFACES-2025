export default class ImageFilters {
    static applyFilter(img, sx, sy, sw, sh, filterType, options = {}) {
        switch (filterType) {
            case 'gray':
                return this.addGray(img, sx, sy, sw, sh);
            case 'glow':
                return this.addGlow(img, sx, sy, sw, sh, options.factor);
            case 'negative':
                return this.addNegative(img, sx, sy, sw, sh);
            default:
                return null;
        }
    }

    static createTempCanvas(img, sx, sy, sw, sh) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        return { canvas: tempCanvas, ctx: tempCtx };
    }

    static addGray(img, sx, sy, sw, sh) {
        const { canvas, ctx } = this.createTempCanvas(img, sx, sy, sw, sh);
        const imageData = ctx.getImageData(0, 0, sw, sh);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    static addGlow(img, sx, sy, sw, sh, factor = 1.3) {
        const { canvas, ctx } = this.createTempCanvas(img, sx, sy, sw, sh);
        const imageData = ctx.getImageData(0, 0, sw, sh);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * factor + 125);
            data[i + 1] = Math.min(255, data[i + 1] * factor + 125);
            data[i + 2] = Math.min(255, data[i + 2] * factor + 125);
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    static addNegative(img, sx, sy, sw, sh) {
        const { canvas, ctx } = this.createTempCanvas(img, sx, sy, sw, sh);
        const imageData = ctx.getImageData(0, 0, sw, sh);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    static getFilterByDifficulty(difficulty) {
        const filterMap = {
            'easy': 'gray',
            'medium': 'glow',
            'hard': 'negative'
        };
        return filterMap[difficulty] || null;
    }
}