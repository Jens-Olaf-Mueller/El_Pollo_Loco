import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { arrIntervals } from '../game.js';
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bonus extends Mobile {
    name = 'bonus';
    height = 50;
    width = 50;
    X = 0;
    Y = -100;
    speedY = 10; // ??
    arrRotation = [];
    animationID = undefined;
    moveID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
        arrIntervals.push(this.animationID, this.moveID);
    }

    initialize() {
        this.arrRotation = loadArray ('./img/Status/Bonus/bonus', 17);
        this.loadImageCache (this.arrRotation, 'bonus_spin');
    }

    animate (visible, pX, pY) {      
        if (visible) {
            this.X = pX;
            this.Y = pY;
            this.moveID = this.moveUp(pX, pY);
            this.animationID = setInterval(() => {
                this.playAnimation(this.arrRotation,'spin');          
            }, 5000 / FPS);
        } else {
            clearInterval (this.moveID);
            clearInterval (this.animationID);
        }
    }
}