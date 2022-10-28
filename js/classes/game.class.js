import { APP_NAME, SOUNDS,
    ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START, BTN_PATH,
    homeScreen, introScreen ,mainScreen, shopScreen, navBar, statusBar, sideBar, posBar, 
    btnDemo, btnStart, btnClose, btnMusic, btnSound, btnPause, btnFeed, btnShop
   } from '../const.js';

import { gameSettings } from '../settings_mod.js';

export default class Game {
    #started = false;
    #name = APP_NAME + '_' + new Date().getUTCDate;
    controls = [];
    settings;

    get isRunning() {return this.#started;}

    constructor() {
        this.settings = gameSettings;
        this.init();
    }

    init() {

    }

    start() {

    }

    over() {

    }
}