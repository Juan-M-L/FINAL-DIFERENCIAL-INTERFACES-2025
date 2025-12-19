// ui/InputHandler.js
// Maneja la entrada del usuario (mouse y touch)

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.isDragging = false;
        this.dragData = null;
        this.mousePos = { x: 0, y: 0 };
        
        // Callbacks
        this.onDragStart = null;
        this.onDragMove = null;
        this.onDragEnd = null;

        this.setupListeners();
    }

    setupListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleEnd(e));

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleStart(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleEnd(e.changedTouches[0]);
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleStart(e) {
        const pos = this.getMousePos(e);
        this.mousePos = pos;
        this.isDragging = true;

        if (this.onDragStart) {
            this.dragData = this.onDragStart(pos.x, pos.y);
        }
    }

    handleMove(e) {
        const pos = this.getMousePos(e);
        this.mousePos = pos;

        if (this.isDragging && this.onDragMove) {
            this.onDragMove(pos.x, pos.y, this.dragData);
        }
    }

    handleEnd(e) {
        if (!this.isDragging) return;

        const pos = this.getMousePos(e);
        this.mousePos = pos;
        this.isDragging = false;

        if (this.onDragEnd) {
            this.onDragEnd(pos.x, pos.y, this.dragData);
        }

        this.dragData = null;
    }

    getDragData() {
        return this.dragData;
    }

    isCurrentlyDragging() {
        return this.isDragging;
    }

    getCurrentMousePos() {
        return this.mousePos;
    }

    cleanup() {
        // Remover listeners si es necesario
        this.isDragging = false;
        this.dragData = null;
    }
}