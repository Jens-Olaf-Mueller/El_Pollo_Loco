
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';
// import Item from './items.class.js';
export default class Food extends Background {
    name = '';
    type = '';
    level;
    value = 0;
    price = 2;
    visible = false;
    onCollisionCourse = true;
    energy = 0;
    sharpness = 0;
    accuracy = 0;
    jumpPower = 0;
    height = 50;
    width = 50;
    eastEnd;
    westEnd;
    X = Infinity;
    Y = Infinity; 

    constructor(imgPath, name, level, pX) {
        super().loadImage(imgPath);
        this.name = name; 
        this.value = parseInt(name.replace(/[^0-9]/g,'')) || 0; // returns only a number from string!
        this.type = name.replace(/[0-9]/g, '');
        this.level = level;
        this.eastEnd = level.eastEnd || CANVAS_WIDTH;
        this.westEnd = -this.eastEnd || -CANVAS_WIDTH; 
        if (pX !== undefined) this.X = pX; 
        this.enabled(true); // calls this.initialize();
    }

    initialize() {
        let range = 100 - this.level.levelNo * 10, rnd = random(1, 100);
        this.visible = (rnd <= range);

        if (this.visible) {
            if (this.X == Infinity) {
                this.X = random (150, this.eastEnd - CANVAS_WIDTH * 0.8);
                // apply a 50:50 chance to place it in east or west
                this.X = Math.random() < 0.5 ? -this.X : this.X; 
            }
            this.Y = 300 + random(1, 50);

            // now tuning the food!
            if (this.type == 'chili') {
                this.sharpness = (this.value - 2) * 5;
                this.jumpPower = Math.round(this.value / 4);
                this.Y -= 250;            
            } else if (this.type == 'food') {
                this.jumpPower = this.value / 2;
                this.energy = this.value;                
            } else if (this.type == 'drink') {
                this.accuracy = (this.value - 3) * 5;
                this.energy = (10 - this.value) / 2;
                this.price = this.value + 1;
            } else if (this.type == 'medicine') {
                this.Y -= 160;
                this.energy = (this.value + 1) * 10;
                this.price = 4;
            } else if (this.type == 'beehive') {
                this.energy = this.value;
                this.jumpPower = this.value / 4;
                this.price = 0;
            }
        }
    }

    enabled(state) {
        if (state == false) {
            this.visible = false;
            this.value = 0;
            this.energy = 0;
            this.sharpness = 0;
            this.accuracy = 0;
            this.jumpPower = 0;        
            this.height = 0;
            this.width = 0;
            return;
        }
        this.initialize();
    }
}