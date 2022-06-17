
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import Background from './background.class.js';

export default class Food extends Background {
// import Item from './items.class.js';
// export default class Food extends Item {
    constructor(imgPath, name, end) {
        super().loadImage(imgPath);
        this.name = name; 
        this.value = name.replace(/[^0-9]/g,'') || 0; // returns only a number from string!
        this.eastEnd = end || CANVAS_WIDTH;
        this.westEnd = -end || -CANVAS_WIDTH;     
        this.initialize();
    }

    name = '';
    value = 0;
    visible = false;
    energy = 0;
    sharpness = 0;
    accuracy = 0;
    jumpPower = 0;
    height = 0;
    width = 0;
    eastEnd;
    westEnd;
    X = -7200;
    Y = 350;

    initialize () {
        let chance = Math.random(),
            rndX = Math.random();

        this.visible = chance > 0.75 ? true : false;
        if (this.visible) {
            this.X = rndX > 0.5 ? rndX * this.eastEnd : rndX * this.westEnd + CANVAS_WIDTH / 2; 
            this.height = 50;// + bgSize;
            this.width = 50; 

            // now tuning the food!
            if (this.name.includes('chili')) {
                this.sharpness = (this.value - 2) * 5;
                this.Y -= 250;            
            } else if (this.name.includes('food')) {
                this.jumpPower = this.value / 3;
                this.energy = this.value;                
            } else if (this.name.includes('drink')) {
                this.accuracy = (this.value - 2) * 5;
                this.energy = this.value / 2;
            }  else if (this.name.includes('medicine')) {
                this.Y -= 150;
                this.energy = (parseInt(this.value) + 5) * 10;
            }
        }
    }

    enabled (state) {
        if (state == false) {
            this.visible = false;
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