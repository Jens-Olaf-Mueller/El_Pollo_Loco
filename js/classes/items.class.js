
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Item  extends Background {
    constructor (imgPath, name, end) { 
        super().loadImage(imgPath);       
        this.name = name;
        this.value = name.replace(/[^0-9]/g,''); // filters a number from string: 'food4' => 4
        this.eastEnd = end || CANVAS_WIDTH;  
        this.westEnd = -end || -CANVAS_WIDTH; 
        this.initialize();
    }

    name = '';
    image;
    visible = true;
    value;
    height = 50;
    width = 50;
    X = 0;
    Y = 0;
    eastEnd;
    westEnd;
    
    initialize() {
        this.X = random (1, this.eastEnd) - CANVAS_WIDTH / 2; 
        this.X = Math.random() < 0.5 ? this.X * -1 : this.X;

        if (this.name.includes('bottle')) {
            this.height = 70;
            this.width = 70;
            this.Y = 370;
        } else  if (this.name.includes('coin')) {
            this.height = 30;
            this.width = 30;
            this.Y = 250;
        // } else if (this.name.includes('chest')) {

        // } else if (this.name.includes('key')) {

        // } else if (this.name.includes('gun')) {

        // } else if (this.name.includes('bullet')) {
        //     this.visible = false;
        // } else if (this.name.includes('seedbag')) {

        } else if (this.name.includes('jar')) {
            this.height = 55;
            this.width = 60;
            this.Y = 380;
        // } else if (this.name.includes('shop')) {

        // } else if (this.name.includes('misc')) {

        // } else if (this.name.includes('coin')) {

        } else  {
            this.enabled(false);
        }

    }

    enabled (state) {
        if (state == false) {
            this.visible = false;        
            this.height = 0;
            this.width = 0;
            return;
        }
        this.initialize();
    }
}