/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';

export default class Background extends Mobile {
    constructor (imgPath, end) {
        super().loadImage(imgPath);
        this.X = end || 0;
        this.Y = CANVAS_HEIGHT - this.height;
    }

    width = CANVAS_WIDTH;   // = 720
    height = CANVAS_HEIGHT; // = 480
}