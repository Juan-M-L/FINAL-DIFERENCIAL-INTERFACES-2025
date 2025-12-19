import Tile from './Tile.js';
import ImageFilters from '../utils/ImageFilters.js';

export default class Level {
    constructor(image, difficulty, gridSize = 2, offsetX = 400, offsetY = 100) {
        this.image = image;
        this.difficulty = difficulty;
        this.gridSize = gridSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.pieceWidth = 400 / gridSize;
        this.pieceHeight = 400 / gridSize;
        this.tiles = [];
        this.completed = false;
        
        this.initializeTiles();
    }

    initializeTiles() {
        const coordinates = [];
        const destinations = [];
        
        // Generar coordenadas basadas en gridSize
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                // Coordenadas de origen en la imagen
                coordinates.push({
                    x: (this.image.width / this.gridSize) * col,
                    y: (this.image.height / this.gridSize) * row
                });
                
                // Coordenadas de destino en el canvas
                destinations.push({
                    x: this.offsetX + (this.pieceWidth * col),
                    y: this.offsetY + (this.pieceHeight * row)
                });
            }
        }

        // Ángulos aleatorios para cada tile
        const totalTiles = this.gridSize * this.gridSize;
        const angles = Array(totalTiles).fill(0).map(() => 
            [0, 90, 180, 270][Math.floor(Math.random() * 4)]
        );

        // Obtener filtro según dificultad
        const filter = ImageFilters.getFilterByDifficulty(this.difficulty);
        console.log(filter);

        for (let i = 0; i < totalTiles; i++) {
            const tile = new Tile(
                i,
                destinations[i].x,
                destinations[i].y,
                this.pieceWidth,
                this.pieceHeight,
                coordinates[i].x,
                coordinates[i].y,
                this.image.width / this.gridSize,
                this.image.height / this.gridSize
            );
            tile.setAngle(angles[i]);
            tile.setFilter(filter);
            this.tiles.push(tile);
        }
    }

    getTileAt(x, y) {
        for (let tile of this.tiles) {
            if (tile.isPointInside(x, y)) {
                return tile;
            }
        }
        return null;
    }

    checkCompletion() {
        this.completed = this.tiles.every(tile => tile.isCorrect());
        return this.completed;
    }

    isCompleted() {
        return this.completed;
    }

    getCompletedImage() {
        return {
            image: this.image,
            x: this.offsetX,
            y: this.offsetY,
            width: this.pieceWidth * this.gridSize,
            height: this.pieceHeight * this.gridSize
        };
    }

    draw(ctx) {
        for (let tile of this.tiles) {
            tile.draw(ctx, this.image);
        }
    }
}