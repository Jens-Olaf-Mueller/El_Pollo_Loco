import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";

export default class Bottle extends Mobile {
    name = 'throwit';
    height = 70;
    width = 70;
    speedY = 0; // ??
    arrRotation = [];

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
        this.applyGravity();

        this.throw (120,150,1);
    }

    initialize() {
        this.arrRotation = loadArray ('./img/Items/Bottles/rotation/spin',8);
        this.loadImageCache (this.arrRotation, 'Bottle_spin');
    }

    throw (pX, pY, speed) {
        this.X = pX;
        this.Y = pY;
        this.speedY = speed;
        //
    }
}