// scenes/MenuScene.js
// Escena del menú principal

class MenuScene extends Scene {
    constructor() {
        super();
        this.setupButtons();
        if (this.menuSection) this.menuSection.style.display = 'block';
        if (this.gameContainer) this.gameContainer.style.display = 'none';
        if (this.howtoModal) this.howtoModal.style.display = 'none';
        if (this.gamemodeModal) this.gamemodeModal.style.display = 'none';
        if (this.boardstyleModal) this.boardstyleModal.style.display = 'none';
        this.selectedBoardStyle = null;
        this.selectedBoardChallenge = null;
    }

    setupButtons() {
        this.playBtn = document.getElementById('pegsolitaire-play-btn');
        this.howtoBtn = document.getElementById('pegsolitaire-howto-btn');
        this.gamemodeBtn = document.getElementById('pegsolitaire-gamemode-btn');
        this.styleBtn = document.getElementById('pegsolitaire-style-btn');
        this.howtoModal = document.getElementById('howto-modal');
        this.gamemodeModal = document.getElementById('gamemode-modal');
        this.boardstyleModal = document.getElementById('boardstyle-modal');
        this.menuSection = document.getElementById('pegsolitaire-menu');
        this.gameContainer = document.getElementById('GameContainer');
        this.gameChallenges = document.querySelectorAll('.pegsolitaire-option__button.challenge');
        this.gameStyles = document.querySelectorAll('.pegsolitaire-option__button.style');

        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.startGame());
        }

        if (this.howtoBtn && this.howtoModal) {
            this.howtoBtn.addEventListener('click', () => this.toggleModal(this.howtoModal));
        }

        if (this.gamemodeBtn && this.gamemodeModal) {
            this.gamemodeBtn.addEventListener('click', () => this.toggleModal(this.gamemodeModal));
        }

        if (this.styleBtn && this.boardstyleModal) {
            this.styleBtn.addEventListener('click', () => this.toggleModal(this.boardstyleModal));
        }

        if (this.gameChallenges) {
            this.gameChallenges.forEach(challengeButton => {
                challengeButton.addEventListener('click', () => this.toggleChallenge(challengeButton));
            });
        }

        if (this.gameStyles) {
            this.gameStyles.forEach(styleButton => {
                styleButton.addEventListener('click', () => this.toggleStyle(styleButton));
            });
        }
    }

    toggleModal(modal) {
        this.gameModals = document.querySelectorAll('.pegsolitaire-menu-modal');
        this.gameModals.forEach(gamemodal => {
            gamemodal.style.display = 'none';            
        });

        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.style.display = 'block';
        }
    }

    toggleChallenge(challengeButton) {
        const allChallengeButtons = document.querySelectorAll('.pegsolitaire-option__button.challenge');
        
        allChallengeButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (challengeButton && challengeButton.classList.contains('challenge')) {
            challengeButton.classList.add('selected');
        }
        
        const challengeTitle = challengeButton.querySelector('.pegsolitaire-option__title')?.textContent;
        let selectedChallenge;
        console.log(challengeTitle);
        switch(challengeTitle) {
            case 'Easy':
                selectedChallenge = BOARD_CONFIGS.CONFIG_1;
                break;
            case 'Normal':
                selectedChallenge = BOARD_CONFIGS.CONFIG_2;
                break;
            case 'Hard':
                selectedChallenge = BOARD_CONFIGS.CONFIG_3;
                break;
            default:
                selectedChallenge = BOARD_CONFIGS.CONFIG_2;
        }
        
        this.selectedBoardChallenge = selectedChallenge;
    }


    toggleStyle(styleButton) {
        const allStyleButtons = document.querySelectorAll('.pegsolitaire-option__button.style');
        
        allStyleButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (styleButton && styleButton.classList.contains('style')) {
            styleButton.classList.add('selected');
        }
        
        const styleTitle = styleButton.querySelector('.pegsolitaire-option__title')?.textContent;
        let selectedStyle;
        
        switch(styleTitle) {
            case 'Pastel':
                selectedStyle = PATHS.STYLE_ONE;
                break;
            case 'Deep Blue':
                selectedStyle = PATHS.STYLE_TWO;
                break;
            case 'Minimalist':
                selectedStyle = PATHS.STYLE_THREE;
                break;
            default:
                selectedStyle = PATHS.STYLE_TWO;
        }
        
        this.selectedBoardStyle = selectedStyle;
    }


    startGame() {
        if (this.menuSection) this.menuSection.style.display = 'none';
        if (this.gameContainer) this.gameContainer.style.display = 'flex';
        
        if (this.sceneManager) {
            this.sceneManager.switchTo('game', [this.selectedBoardStyle, this.selectedBoardChallenge]);
        }
    }

    init() {
        super.init();
    }

    render(ctx) {
        // El menú se renderiza con HTML/CSS, no en canvas
        // Solo limpiamos el canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    cleanup() {
        super.cleanup();
        if (this.howtoModal) this.howtoModal.style.display = 'none';
    }
}