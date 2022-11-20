import { APP_NAME, SOUNDS, DEF_HIGHSCORES,
    ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START, BTN_PATH,
    homeScreen, introScreen ,mainScreen, shopScreen, navBar, statusBar, sideBar, posBar, 
    btnDemo, btnStart, btnClose, btnMusic, btnSound, btnPause, btnFeed, btnShop
   } from '../const.js';

import { gameSettings } from '../settings_mod.js';
import { getTime$ } from '../library.js';
import Backend from './backend.class.js';

export default class Game {
    #started = false;
    #name = APP_NAME + '_' + getTime$();
    controls = [];
    settings;
    backend = new Backend();
    highscores = [];

    get isRunning() {return this.#started;}

    constructor() {
        this.settings = gameSettings;
        this.init();
    }

    init() {
        this.loadHighScores();
    }

    start() {

    }

    over() {

    }

    loadHighScores() {
        this.highscores = this.backend.getItem('EPL_HighScores') || DEF_HIGHSCORES;
    }
}