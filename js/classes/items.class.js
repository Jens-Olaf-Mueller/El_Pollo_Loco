
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Item extends Background {
    name = '';
    type = '';
    level;
    image;
    visible = true;
    isBackground = false;
    value;
    height = 70;
    width = 70;
    X = Infinity;
    Y = Infinity;
    eastEnd;
    westEnd;

    constructor (imgPath, name, level) { 
        super().loadImage(imgPath);       
        this.name = name;
        // returns only a number from string: 'food4' => 4
        this.value = parseInt(name.replace(/[^0-9]/g,'')) || 0; 
        this.type = name.replace(/[0-9]/g, '');
        this.level = level;
        this.eastEnd = level.eastEnd || CANVAS_WIDTH;  
        this.westEnd = -this.eastEnd || -CANVAS_WIDTH; 
        this.enabled(true); // calls this.initialize();
    }
    
    initialize() {
        this.X = random (150, this.eastEnd - CANVAS_WIDTH * 0.8);
        this.X = Math.random() < 0.5 ? -this.X : this.X;
        // console.log(this.name + 'X: ' + this.X )

        if (this.type == 'bottle') {
            this.Y = 370;
        } else if (this.type == 'coin') {
            this.value++;
            this.height = 30;
            this.width = 30;
            this.Y = 250 - this.value * 20 - this.value;        
        } else if (this.type == 'chest') {
            this.height = 90;
            this.width = 100;
            this.Y = 360;
        } else if (this.type == 'shop') {
            this.height = 270;
            this.width = 220;
            this.Y = 150;
            this.isBackground = true;
        // } else if (this.type == 'key') {

        // } else if (this.type == 'gun') {

        // } else if (this.type == 'bullet') {
        //     this.visible = false;
        // } else if (this.type == 'seedbag') {

        } else if (this.type == 'jar') {
            this.height = 55;
            this.width = 60;
            this.Y = 380;
        } else if (this.type == 'misc') {
            this.Y = 400 + Math.random() * 20;
            this.isBackground = Math.random() < 0.5;
            if (this.isBackground) {
                this.height = 40;
                this.width = 40;
                this.Y = this.Y - 40;
            }
        } else  {
            this.enabled(false);
        }
    }

    enabled (state) {
        if (state == false) {
            this.visible = false; 
            this.value = 0;       
            this.height = 0;
            this.width = 0;
            return;
        }
        this.initialize();
    }
}