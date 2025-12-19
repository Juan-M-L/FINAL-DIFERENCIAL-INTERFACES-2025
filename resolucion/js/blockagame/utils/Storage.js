export default class Storage {
    constructor(key = 'blockaBestTimes') {
        this.key = key;
    }

    getBestTimes() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : {};
    }

    saveBestTime(difficulty, time) {
        const bestTimes = this.getBestTimes();
        bestTimes[difficulty] = time;
        localStorage.setItem(this.key, JSON.stringify(bestTimes));
    }

    getBestTime(difficulty) {
        const bestTimes = this.getBestTimes();
        return bestTimes[difficulty] || 0;
    }

    clearBestTimes() {
        localStorage.removeItem(this.key);
    }
}