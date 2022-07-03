import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { arrIntervals } from '../game.js';
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bonus extends Mobile {
    name = 'Bonus';
    height = 50;
    width = 50;
    X = 0;
    Y = -100;
    speedY = 10; // ??
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
        arrIntervals.push(this.animationID, this.moveID);
    }

    initialize() {
        this.arrAnimation = loadArray ('./img/Status/Bonus/spin', 16);
        this.loadImageCache (this.arrAnimation,this.name);
    }

    animate (visible, pX, pY) {      
        if (visible) {
            this.X = pX;
            this.Y = pY;
            this.moveID = this.moveUp(pX, pY);
            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation,'spin');          
            }, 5000 / FPS);
        } else {
            clearInterval (this.moveID);
            clearInterval (this.animationID);
        }
    }
}