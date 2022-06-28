import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bottle extends Mobile {
    name = 'bottle';
    height = 60;
    width = 60;
    X = 0;
    Y = 350;
    speedY = 10; // ??
    arrRotation = [];
    animationID = undefined;
    moveID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
        // debugger
        this.applyGravity();

        this.throw (0,150,10);
        this.animate(true,0,150);
    }

    initialize() {
        this.arrRotation = loadArray ('./img/Items/Bottles/rotation/spin',8);
        this.loadImageCache (this.arrRotation, 'bottle_spin');
    }

    throw (pX, pY, speed) {
        this.X = pX;
        this.Y = pY;
        this.speedY = speed;
        //
    }

    animate (visible, pX, pY) {      
        if (visible) {
            this.X = pX;
            this.Y = pY;
            // this.moveID = this.moveUp(pX, pY);
            this.animationID = setInterval(() => {
                this.playAnimation(this.arrRotation,'spin');          
            }, 4000 / FPS);
        } else {
            clearInterval (this.moveID);
            clearInterval (this.animationID);
        }
    }
}