
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Food extends Background {
    name = '';
    type = '';
    X = Infinity;
    Y = Infinity;
    height = 50;
    width = 50;
    level;
    value = 0;
    price = 0;
    visible = false;
    onCollisionCourse = true;
    energy = 0;
    sharpness = 0;
    accuracy = 0;
    jumpPower = 0;


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
        this.visible = (rnd <= range) || this.value == 120;
        if (this.visible) {
            if (this.X == Infinity) {
                this.X = random (150, this.eastEnd - 75);
                // apply a 50:50 chance to place it in east or west
                // this.X = Math.random() < 0.5 ? -this.X : this.X;
                this.X = this.fivty50 ? -this.X : this.X;
            }
            this.Y = this.value == 120 ? 320 : 300 + random(1, 50);
            // now tuning the food!
            switch (this.type) {
                case 'food': this.initFoodProps();
                break;
                case 'chili': this.initChiliProps();
                break;
                case 'drink': this.initDrinkProps();
                break;
                case 'medicine': this.initMedicineProps();
                break;
                // case 'beehive':
                // break;
                default:
                    this.energy = this.value;
                    this.jumpPower = this.value / 4;
                break;
            }

            // now tuning the food!
            // if (this.type == 'chili') {
                // this.sharpness = (this.value - 2) * 5;
                // this.jumpPower = Math.round(this.value / 4);
                // this.price = 3;
                // this.Y -= 250;            
            // } else if (this.type == 'food') {
                // this.jumpPower = this.value / 2;
                // this.energy = this.value;
                // this.price = 2;              
            // } else if (this.type == 'drink') {
            //     this.accuracy = (this.value - 3) * 5;
            //     this.energy = (10 - this.value) / 2;
            //     this.price = 3 + this.value;
            // } else if (this.type == 'medicine') {
            //     this.Y -= 160;
            //     this.energy = (this.value + 1) * 10;
            //     this.price = 5;
            // } else if (this.type == 'beehive') {
            //     this.energy = this.value;
            //     this.jumpPower = this.value / 4;
            // }
        }
    }


    initFoodProps() {
        this.jumpPower = this.value / 2;
        this.energy = this.value;
        this.price = 2;  
    }


    initChiliProps() {
        this.sharpness = (this.value - 2) * 5;
        this.jumpPower = Math.round(this.value / 4);
        this.price = 3;
        this.Y -= 250; 
    }


    initDrinkProps() {
        this.accuracy = (this.value - 3) * 5;
        this.energy = (10 - this.value) / 2;
        this.price = 3 + this.value;
    }
    

    initMedicineProps() {
        this.Y -= 160;
        this.energy = (this.value + 1) * 10;
        this.price = 5;
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