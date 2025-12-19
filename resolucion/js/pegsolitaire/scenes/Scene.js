// scenes/Scene.js
// Clase base para todas las escenas

class Scene {
    constructor() {
        this.isInitialized = false;
    }

    // Se llama cuando la escena se activa
    init() {
        this.isInitialized = true;
    }

    // Actualiza la lógica de la escena (cada frame)
    update(deltaTime) {
        // Override en subclases
    }

    // Renderiza la escena en el canvas
    render(ctx) {
        // Override en subclases
    }

    // Se llama cuando la escena se desactiva
    cleanup() {
        this.isInitialized = false;
    }

    // Hook para manejar eventos de teclado
    handleKeyPress(key) {
        // Override en subclases si es necesario
    }

    // Hook para obtener referencia al SceneManager
    setSceneManager(sceneManager) {
        this.sceneManager = sceneManager;
    }
}