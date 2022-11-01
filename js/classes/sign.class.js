import Background from './background.class.js';
import { CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';

export default class Sign extends Background {
    typeNr;
    level;
    shopLeft = undefined;
    height = 150;
    width = 120;

    constructor(shopX, type, level) {
        super();
        this.shopLeft = shopX;
        this.typeNr = type;
        this.level = level;        
        this.initialize();    
    }

    initialize() {
        this.setZindex();
        this.X = random(0, this.level.eastEnd - CANVAS_WIDTH * 0.125);
        this.X = this.fivty50 ? -this.X : this.X;
        if (this.X < this.level.westEnd) this.X = this.level.westEnd + 2 * this.width;
        let path = './img/Items/Signs/sign ';
        if (this.X < this.shopLeft) {
            path += 'east.png';
        } else if (this.X > this.level.shop.right) {
            path += 'west.png';
        } else {
            path += 'here.png';
            this.isBackground = false;
        }
        this.loadImage(path);
    }

    // evl. in Background-Class...?!
    setZindex() {
        this.Y = 350 + Math.random() * 20;
        this.isBackground = this.fivty50;
        if (this.isBackground) {
            this.height -= 20;
            this.width -= 30;
            this.Y -= 60;
        }
    }
}