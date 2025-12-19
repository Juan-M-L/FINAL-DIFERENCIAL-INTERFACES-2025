// AssetManager - Gestiona la carga de todos los recursos del juego
// (imágenes, sonidos, sprites)

export class AssetManager {
  constructor() {
    // Imágenes.
    this.images = {
      dragon: null,
      coin: null,
      pipeTop: null,
      pipeBottom: null,
      explosion: null,
      increasesize: null,
      // Parallax layers.
      layer1: null,
      layer2: null,
      layer3: null,
      layer4: null
    };

    // Sonidos.
    this.sounds = {
      jump: null,
      hit: null,
      point: null
    };

    // Estado de carga.
    this.loaded = false;
    this.loadProgress = 0;
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  // Carga todos los assets del juego.
  async loadAll() {
    console.log('Iniciando carga de assets...');

    const imagePromises = [
      this.loadImage('dragon', '../media/flappybird/dragon.png'),
      this.loadImage('coin', '../media/flappybird/coin.png'),
      this.loadImage('pipeTop', '../media/flappybird/pipe_top.png'),
      this.loadImage('pipeBottom', '../media/flappybird/pipe_bottom.png'),
      this.loadImage('explosion', '../media/flappybird/explosions.png'),
      this.loadImage('increasesize', '../media/flappybird/size_increase.png'),
      this.loadImage('decreasepipegap', '../media/flappybird/pipe_gap_decrease.png'),
      this.loadImage('layer1', '../media/flappybird/parallax/1.png'),
      this.loadImage('layer2', '../media/flappybird/parallax/2.png'),
      this.loadImage('layer3', '../media/flappybird/parallax/3.png'),
      this.loadImage('layer4', '../media/flappybird/parallax/4.png')
    ];

    const soundPromises = [
      this.loadSound('jump', '../media/flappybird/jump.mp3'),
      this.loadSound('hit', '../media/flappybird/hit.mp3'),
      this.loadSound('point', '../media/flappybird/point.mp3')
    ];

    this.totalAssets = imagePromises.length + soundPromises.length;

    try {
      // Cargar todas las imágenes y sonidos en paralelo
      await Promise.all([...imagePromises, ...soundPromises]);
      
      this.loaded = true;
      this.loadProgress = 1;
      console.log('Todos los assets cargados correctamente');
    } catch (error) {
      console.error('Error al cargar assets:', error);
      throw error;
    }
  }

  // Carga una imagen.
  loadImage(key, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images[key] = img;
        this.loadedAssets++;
        this.loadProgress = this.loadedAssets / this.totalAssets;
        console.log(`Imagen cargada: ${key} (${Math.round(this.loadProgress * 100)}%)`);
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.error(`Error al cargar imagen ${key} desde ${path}:`, error);
        // Crear imagen vacía para no romper el juego
        this.images[key] = img;
        this.loadedAssets++;
        resolve(img);
      };
      
      img.src = path;
    });
  }


  // Carga un sonido.
  loadSound(key, path) {
    return new Promise((resolve) => {
      const audio = new Audio(path);
      
      audio.oncanplaythrough = () => {
        this.sounds[key] = audio;
        this.loadedAssets++;
        this.loadProgress = this.loadedAssets / this.totalAssets;
        console.log(`Sonido cargado: ${key} (${Math.round(this.loadProgress * 100)}%)`);
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        console.warn(`Error al cargar sonido ${key} desde ${path}:`, error);
        // Crear audio silencioso.
        this.sounds[key] = audio;
        this.loadedAssets++;
        resolve(audio);
      };
      
      // Iniciar carga.
      audio.load();
    });
  }

  // Obtiene una imagen por su clave.
  getImage(key) {
    return this.images[key];
  }

  // Obtiene un sonido por su clave.
  getSound(key) {
    return this.sounds[key];
  }

  // Verifica si todos los assets están cargados.
  isLoaded() {
    return this.loaded;
  }

  // Obtiene el progreso de carga. (0-1)
  getLoadProgress() {
    return this.loadProgress;
  }

  // Clona un sonido para reproducción simultánea.
  cloneSound(key) {
    const original = this.sounds[key];
    if (!original) return null;
    
    return original.cloneNode();
  }
}