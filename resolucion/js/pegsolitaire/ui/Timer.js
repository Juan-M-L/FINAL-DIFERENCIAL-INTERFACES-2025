// ui/Timer.js
// Temporizador del juego

class Timer {
    constructor(duration, onTimeout) {
        this.duration = duration;
        this.onTimeout = onTimeout || (() => {});
        this.startTime = null;
        this.running = false;
        this.timeRemaining = duration;
    }

    start() {
        this.startTime = performance.now();
        this.running = true;
    }

    pause() {
        if (this.running) {
            this.running = false;
            this.timeRemaining = this.getTimeRemaining();
        }
    }

    resume() {
        if (!this.running && this.timeRemaining > 0) {
            this.duration = this.timeRemaining;
            this.start();
        }
    }

    reset() {
        this.running = false;
        this.startTime = null;
        this.timeRemaining = this.duration;
    }

    getTimeRemaining() {
        if (!this.running) return this.timeRemaining;
        const elapsed = performance.now() - this.startTime;
        return Math.max(this.duration - elapsed, 0);
    }

    update() {
        if (!this.running) return;

        const remaining = this.getTimeRemaining();
        
        if (remaining <= 0) {
            this.running = false;
            this.timeRemaining = 0;
            this.onTimeout();
        }
    }

    format() {
        const totalMs = Math.max(this.getTimeRemaining(), 0);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    }
}