import Storage from '../utils/Storage.js';

export default class Timer {
    constructor(displayElement, maxDisplayElement) {
        this.displayElement = displayElement;
        this.maxDisplayElement = maxDisplayElement;
        this.storage = new Storage();
        
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.currentDifficulty = 'easy';
        
        this.updateDisplay();
        this.updateMaxDisplay();
    }

    timeToString(time) {
        const mins = Math.floor((time % 3600000) / 60000);
        const secs = Math.floor((time % 60000) / 1000);
        const ms = Math.floor(time % 1000);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
    }

    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = this.timeToString(this.elapsedTime);
        }
    }

    updateMaxDisplay() {
        if (this.maxDisplayElement) {
            const best = this.storage.getBestTime(this.currentDifficulty);
            this.maxDisplayElement.textContent = `Mejor tiempo (${this.currentDifficulty}): ${this.timeToString(best)}`;
        }
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.updateMaxDisplay();
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 10);
        this.updateMaxDisplay();
    }

    pause() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    reset() {
        this.pause();
        
        // Save best time if applicable
        const bestTime = this.storage.getBestTime(this.currentDifficulty);
        if (this.elapsedTime > 0 && (bestTime === 0 || this.elapsedTime < bestTime)) {
            this.storage.saveBestTime(this.currentDifficulty, this.elapsedTime);
        }
        
        this.elapsedTime = 0;
        this.updateDisplay();
        this.updateMaxDisplay();
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

    isRunning() {
        return this.timerInterval !== null;
    }
}