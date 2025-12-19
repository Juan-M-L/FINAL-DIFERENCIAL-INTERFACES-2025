export default class ImageLoader {
    static imageList = {
        NATURE: {THUMBNAIL: '../media/blockaImages/nature/3_LagoBosqueMontania.png', IMAGES: [
            '../media/blockaImages/nature/1_Casas.png',
            '../media/blockaImages/nature/2_RocaEnMedio.png',
            '../media/blockaImages/nature/3_LagoBosqueMontania.png',
            '../media/blockaImages/nature/4_OtroLagoBosqueMontania.png',
            '../media/blockaImages/nature/5_MontaniaFlores.png',
            '../media/blockaImages/nature/6_CampoFlores.png'
        ]},
        SPACE: {THUMBNAIL: '../media/blockaImages/space/2_PilaresDeLaCreacion.png', IMAGES: [
            '../media/blockaImages/space/1_EstacionEspacialInternacional.png',
            '../media/blockaImages/space/2_PilaresDeLaCreacion.png',
            '../media/blockaImages/space/3_ViaLactea.png',
            '../media/blockaImages/space/4_Marte.png',
            '../media/blockaImages/space/5_NebulosaMariposa.png',
            '../media/blockaImages/space/6_TelescopioHubble.png'
        ]},
        CITIES: {THUMBNAIL: '../media/blockaImages/cities/3_NuevaYork.png', IMAGES: [
            '../media/blockaImages/cities/1_Venecia.png',
            '../media/blockaImages/cities/2_Estambul.png',
            '../media/blockaImages/cities/3_NuevaYork.png',
            '../media/blockaImages/cities/4_Londres.png',
            '../media/blockaImages/cities/5_Paris.png',
            '../media/blockaImages/cities/6_Queenstown.png'
        ]}
    };

    static gridImages = ['../media/blockaImages/grid-dimensions/2X2.png', '../media/blockaImages/grid-dimensions/3X3.png', '../media/blockaImages/grid-dimensions/4X4.png'];

    static gridList = [2, 3, 4];

    static getGridImages() {
        return this.gridImages;
    }

    static getGridSize(index) {
        return this.gridList[index] || 2;
    }

    static getRandomImagePath(themedImages) {
        const index = Math.floor(Math.random() * themedImages.length);
        return themedImages[index];
    }

    static loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
            img.src = imagePath;
        });
    }

    static async loadRandomImage(theme = 'NATURE') {
        const themedImages = this.imageList[theme].IMAGES;
        const path = this.getRandomImagePath(themedImages);
        return await this.loadImage(path);
    }

    static getImageList() {
        console.log(this.imageList);
        return this.imageList;
    }
}