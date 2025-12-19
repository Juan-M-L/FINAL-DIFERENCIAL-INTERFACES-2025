// utils/Constants.js
// Constantes globales del juego

const GAME_CONFIG = {
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 600,
    CELL_SIZE: 85,
    BOARD_ROWS: 7,
    BOARD_COLS: 7,
    TIMER_DURATION: 10 * 60 * 1000, // 10 minutos en ms
};

const PATHS = {
    STYLE_ONE: {
        BOARD_BG: '../media/PegSolitarie/estilo_uno/board.png',
        FICHA_AZUL: '../media/PegSolitarie/estilo_uno/ej_ficha_azul.png',
        FICHA_ROJA: '../media/PegSolitarie/estilo_uno/fichaRoja.png',
        FICHA_VIOLETA: '../media/PegSolitarie/estilo_uno/fichaVioleta.png'
    },
    STYLE_TWO: {
        BOARD_BG: '../media/PegSolitarie/estilo_dos/board.png',
        FICHA_AZUL: '../media/PegSolitarie/estilo_dos/ej_ficha_azul.png',
        FICHA_ROJA: '../media/PegSolitarie/estilo_dos/fichaRoja.png',
        FICHA_VIOLETA: '../media/PegSolitarie/estilo_dos/fichaVioleta.png'
    },
    STYLE_THREE: {
        BOARD_BG: '../media/PegSolitarie/estilo_tres/board.png',
        FICHA_AZUL: '../media/PegSolitarie/estilo_tres/ej_ficha_azul.png',
        FICHA_ROJA: '../media/PegSolitarie/estilo_tres/fichaRoja.png',
        FICHA_VIOLETA: '../media/PegSolitarie/estilo_tres/fichaVioleta.png'
    }
};

const COLORS = {
    CELL_STROKE: '#00fffbff',
    CELL_FILL: '#f5f5f5',
    HINT_COLOR: 'rgba(0, 255, 225, 0.8)',
    HINT_SHADOW: '#000000ff',
};

const BOARD_CONFIGS = {
    CONFIG_1: [
        [null, null, 0, 0, 0, null, null],
        [null, null, 0, 0, 0, null, null],
        [0,    0,    0, 0, 0,    0,    0],
        [0,    0,    0, 0, 'azul', 'roja', 0],
        [0,    0,    0, 0, 0,    0,    0],
        [null, null, 0, 0, 0, null, null],
        [null, null, 0, 0, 0, null, null]
    ],
    CONFIG_2: [
        [null, null, 'azul', 'roja', 'violeta', null, null],
        [null, null, 'azul', 'roja', 'violeta', null, null],
        ['azul', 'roja', 'violeta', 'azul', 'roja', 'violeta', 'azul'],
        ['roja', 'violeta', 'azul', 0, 'roja', 'violeta', 'azul'],
        ['azul', 'roja', 'violeta', 'azul', 'roja', 'violeta', 'azul'],
        [null, null, 'azul', 'roja', 'violeta', null, null],
        [null, null, 'azul', 'roja', 'violeta', null, null]
    ],
    CONFIG_3: [
        [null, null, 'roja', 'roja', 'roja', null, null],
        [null, 'roja', 'roja', 'roja', 'roja', 'roja', null],
        [0,    'roja', 0, 'roja', 0, 'roja', 0],
        [0,    'roja', 'roja', 0, 'roja', 'roja', 0],
        [0,    0,    'roja', 'roja', 'roja', 0,   0],
        [null, null, 'roja', 'roja', 'roja', null, null],
        [null, null, 'roja', 0, 'roja', null, null]
    ]
};

const DIRECTIONS = {
    JUMP_2: [
        { di: -2, dj: 0 },  // arriba
        { di: 2, dj: 0 },   // abajo
        { di: 0, dj: -2 },  // izquierda
        { di: 0, dj: 2 },   // derecha
    ],
    JUMP_3: [
        { di: -3, dj: 0 },  // arriba
        { di: 3, dj: 0 },   // abajo
        { di: 0, dj: -3 },  // izquierda
        { di: 0, dj: 3 },   // derecha
    ],
};