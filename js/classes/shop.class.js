import Mobile from './mobile.class.js';
import { CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';
const CLOSED = 0, OPEN = 1;

export default class Shop extends Mobile {
    name = 'Shop';
    type = 'shop';
    imagePath = [];
    level;
    isBackground = true;
    isOpen = false;

    constructor(imgPath, level) {         
        super()
        this.level = level;
        this.imagePath[CLOSED] = imgPath.substring(0, imgPath.lastIndexOf('/')) + '/shop0.png';
        this.imagePath[OPEN] = imgPath.substring(0, imgPath.lastIndexOf('/')) + '/shop1.png';
        this.loadImage(this.imagePath[CLOSED]);
        this.height = 270;
        this.width = 220;
        this.Y = 150;
        this.X = random (150, level.eastEnd - CANVAS_WIDTH * 0.8);
        this.X = Math.random() < 0.5 ? -this.X : this.X;

    }

    price (item) {
        if (item == 'medicine') { 
            return parseInt((50 + Math.random() * 100) * this.level.levelNo * 10);
        } else if (item == 'gun') {
            return this.level.levelNo * 1000;
        } else if (item == 'bullet') {
            return parseInt((10 + Math.random() * 100) * this.level.levelNo * 10);
        }
    }
}