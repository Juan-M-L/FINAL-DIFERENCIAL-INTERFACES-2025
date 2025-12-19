import Modal from './Modal.js';
import ImageLoader from '../utils/ImageLoader.js';

export default class Menu {
    constructor(onStart) {
        this.onStart = onStart;
        this.selectedImageIndex = 0;
        this.selectedThemeIndex = 'NATURE'; // Índice de categoría
        this.selectedDimensionsIndex = 0;
        this.menuElement = document.getElementById('blocka-menu');
        this.startButton = document.getElementById('blocka-start-btn');
        
        this.initializeModals();
        this.initializeThemeSelector();
        this.initializeGallery();
        this.initializeDimensionsSelector();
        this.initializeStartButton();
    }

    initializeDimensionsSelector() {
        const gridSizes = ImageLoader.gridList;
        const gridThumbnails = ImageLoader.getGridImages();
        const container = document.getElementById('blocka-dimensions-images');
        
        if (!container) return;

        container.innerHTML = '';

        gridSizes.forEach((size, index) => {
            const card = document.createElement('div');
            card.className = 'blocka-dimensions-card';
            if (index === this.selectedDimensionsIndex) {
                card.classList.add('selected');
            }

            const title = document.createElement('h3');
            title.textContent = `${size}x${size}`;

            const image = document.createElement('img');
            image.src = gridThumbnails[index];
            image.alt = "Image";

            card.appendChild(image);
            card.appendChild(title);

            card.addEventListener('click', () => {
                this.selectedDimensionsIndex = index;
                console.log('Dimensión seleccionada:', size);

                this.blockaDimensionsModal.close();

                document.querySelectorAll('.blocka-dimensions-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
            });

            container.appendChild(card);
        });
    }

    initializeModals() {
        this.howtoModal = new Modal('howto-modal', 'blocka-howto-btn', 'close-howto');
        this.galleryModal = new Modal('gallery-modal', 'blocka-gallery-btn', 'close-gallery');
        this.blockaDimensionsModal = new Modal('dimensions-modal', 'blocka-dimensions-btn', 'close-blocka-dimensions');
        this.blockaThemeModal = new Modal('theme-modal', 'blocka-theme-btn', 'close-blocka-theme');
    }

    initializeGallery() {
        const allImages = ImageLoader.getImageList();

        const container = document.getElementById('blocka-gallery-images');
        if (!container) return;

        container.innerHTML = '';
        
        for (const [index, img] of Object.entries(allImages[this.getSelectedThemeIndex()].IMAGES)) {
            const card = document.createElement('div');
            card.className = 'blocka-gallery-card';
            if (index === this.getSelectedImageIndex()) {
                card.classList.add('selected');
            }            
            const image = document.createElement('img');
            image.src = img;
            image.alt = "Image";
            card.appendChild(image);

            card.addEventListener('click', () => {
                this.selectedImageIndex = index;
                console.log('Imagen seleccionada:', index, "Image");
                
                this.galleryModal.close();
                
                document.querySelectorAll('.blocka-gallery-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
            });

            container.appendChild(card);
        };
    }

    initializeThemeSelector() {
        const categories = ImageLoader.getImageList();
        const container = document.getElementById('blocka-theme-images');
        
        if (!container) return;

        container.innerHTML = '';

        for (const [theme, index] of Object.entries(categories)) {
            const card = document.createElement('div');
            card.className = 'blocka-theme-card';
            if (theme === this.getSelectedThemeIndex()) {
                card.classList.add('selected');
            }

            const image = document.createElement('img');
            image.src = index.THUMBNAIL;
            image.alt = "Theme";
            
            const title = document.createElement('h3');
            title.textContent = theme;

            card.appendChild(image);
            card.appendChild(title);

            card.addEventListener('click', () => {
                this.setSelectedThemeIndex(theme);
                console.log('Tema seleccionado:', theme);

                this.blockaThemeModal.close();

                document.querySelectorAll('.blocka-theme-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');

                // Actualizar galería con imágenes del tema seleccionado
                this.initializeGallery();
            });

            container.appendChild(card);
        };
    }

    initializeStartButton() {
        if (!this.startButton) return;
        
        this.startButton.addEventListener('click', () => {
            this.hide();
            if (this.onStart) {
                const images = ImageLoader.getImageList();
                const selectedImagePath = images[this.getSelectedThemeIndex()];
                const selectedImage = selectedImagePath.IMAGES[this.getSelectedImageIndex()];
                
                // Pasar tanto la imagen como el tema
                this.onStart(selectedImage, this.getSelectedThemeIndex(), this.selectedDimensionsIndex);
            }
        });
    }

    show() {
        if (this.menuElement) {
            this.menuElement.style.display = 'flex';
        }
    }

    hide() {
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
        }
    }

    getSelectedImageIndex() {
        return this.selectedImageIndex;
    }

    setSelectedImageIndex(value) {
        this.selectedImageIndex = value;
    }

    getSelectedThemeIndex() {
        return this.selectedThemeIndex;
    }

    setSelectedThemeIndex(value) {
        this.selectedThemeIndex = value;
    }

    getSelectedImagePath() {
        const categories = ImageLoader.getImageList();
        const selectedCategory = categories[this.selectedThemeIndex];
        return selectedCategory.images[this.selectedImageIndex];
    }
}