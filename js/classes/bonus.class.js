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
    speedY = 10;  
    speed = 2.25;
    visible = false;
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
    }

    initialize() {
        this.arrAnimation = loadArray ('./img/Status/Bonus/spin', 16);
        this.loadImageCache (this.arrAnimation,this.name);
    }

    animate (pX, pY) { 
        if ( this.moveID == undefined) { 
            this.X = pX;
            this.Y = pY;
            this.moveID = this.moveUp(pX, this.speed);
            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation,'spin');          
            }, 5000 / FPS);
        }
    }
}