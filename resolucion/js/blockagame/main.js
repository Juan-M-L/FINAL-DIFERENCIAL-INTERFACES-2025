import Game from './game/Game.js';
import Menu from './ui/Menu.js';

document.addEventListener('DOMContentLoaded', function() {
    const game = new Game('GameCanvas');
    
    const menu = new Menu((imageIndex, theme, gridSizeIndex) => {
        game.start(imageIndex, theme, gridSizeIndex);
    });
});