// SceneManager.js
// Gestiona las diferentes escenas del juego

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.lastTime = performance.now();
    }

    add(name, scene) {
        this.scenes[name] = scene;
        scene.setSceneManager(this);
    }

    switchTo(name, data) {
        if (!this.scenes[name]) {
            console.error(`Scene "${name}" no existe`);
            return;
        }

        // Limpiar escena actual
        if (this.currentScene) {
            this.currentScene.cleanup();
        }

        // Cambiar a nueva escena
        this.currentScene = this.scenes[name];
        this.currentScene.init(data);
        this.lastTime = performance.now();
    }

    update() {
        if (!this.currentScene) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.currentScene.update(deltaTime);
    }

    render(ctx) {
        if (!this.currentScene) return;
        this.currentScene.render(ctx);
    }

    getCurrentScene() {
        return this.currentScene;
    }

    handleKeyPress(key) {
        if (this.currentScene && this.currentScene.handleKeyPress) {
            this.currentScene.handleKeyPress(key);
        }
    }
}