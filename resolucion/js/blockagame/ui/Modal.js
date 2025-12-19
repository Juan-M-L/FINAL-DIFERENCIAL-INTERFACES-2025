export default class Modal {
    constructor(modalId, openButtonId, closeButtonId) {
        this.modal = document.getElementById(modalId);
        this.openButton = document.getElementById(openButtonId);
        this.closeButton = document.getElementById(closeButtonId);
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (!this.modal || !this.openButton || !this.closeButton) {
            return;
        }

        this.openButton.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }

    isOpen() {
        return this.modal && this.modal.classList.contains('active');
    }
}