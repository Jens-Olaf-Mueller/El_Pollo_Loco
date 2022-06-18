/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';

export default class Background extends Mobile {
    level;
    width = CANVAS_WIDTH;   // = 720
    height = CANVAS_HEIGHT; // = 480

    constructor (imgPath, pX, level) {
        super().loadImage(imgPath);
        this.level = level;
        this.X = pX || 0;
        this.Y = CANVAS_HEIGHT - this.height;
    }
}