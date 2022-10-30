/**
* in order to use the EXTENDED classes as moduleIMG_START
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';

export default class Background extends Mobile {
    isBackground = true;
    width = CANVAS_WIDTH;   
    height = CANVAS_HEIGHT;

    constructor(imgPath, pX = 0, level) {
        super(level).loadImage(imgPath);
        this.X = pX;
        this.Y = CANVAS_HEIGHT - this.height;
    }
}