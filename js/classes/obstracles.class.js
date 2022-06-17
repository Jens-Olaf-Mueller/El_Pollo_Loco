
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Obstracle extends Background {
    constructor (imgPath, name, end) { 
        super().loadImage(imgPath);
        // console.log('Image: ' + this.image.src )
        this.name = name;
        this.value = name.replace(/[^0-9]/g,'') || 0; // returns only a number from string!
        // this.damage = this.value;
        this.eastEnd = end || CANVAS_WIDTH;  
        this.westEnd = -end || -CANVAS_WIDTH;   
        this.initialize();
    };   

    name = '';
    value = 0;
    visible = false;
    isBackground = false;
    onCollisionCourse = false;
    canBeOnTop = false;
    damage = 0;
    height = 50;
    width = 50;
    eastEnd;
    westEnd;
    X = Infinity;
    Y = Infinity;

    initialize () {
        this.visible = random(0, 100) > 50 ? true : false;
        if (this.visible) {
            let bgSize = random(1, 30);
            this.height += bgSize;
            this.X = random (1, this.eastEnd) - CANVAS_WIDTH / 2; 
            this.X = Math.random() < 0.5 ? this.X * -1 : this.X;
            this.Y = 430 - Math.random() * this.height;
            let bgRange = this.Y + this.height;
            this.onCollisionCourse = bgRange >= 430 && bgRange <= 460;

            this.setBackground(bgSize);           
            if (this.name.includes('tree')) this.setTreeProperties();
            if (this.name.includes('stone')) this.setStoneProperties();
            if (this.name.includes('cactus')) this.setCactusProperties();                
            if (this.name.includes('bees')) this.setBeeProperties();            
        }
    }

    setBackground (bgSize) {
        this.isBackground = bgSize <= 12 && !(this.onCollisionCourse) || (this.name == 'stone_big0') ? true : false;
        
        if (this.isBackground) {
            this.Y -= 50;
            this.height -= bgSize * 2.5;
            this.width -= bgSize * 2;
        } 
    }

    setTreeProperties () {
        this.Y = 100;
        this.height = 340;
        this.width = 220;
        this.damage = 0.1;
    }

    setStoneProperties () {
        if (this.name == 'stone_big0') this.onCollisionCourse = false; // never colliding!
        this.Y = this.isBackground ? 280 : 330;
        this.height = 150;
        this.width = 150;
        this.damage = 0.25;
        this.canBeOnTop = this.onCollisionCourse;
    }

    setCactusProperties () {
        this.Y = this.isBackground ? 280 : 340;
        this.height = 100;
        this.width = 90;
        this.damage = 0.33;
    }

    setBeeProperties () {
        this.Y = this.isBackground ? 200 : 300;
        this.height = 33;
        this.width = 33;
        this.damage = 0.5;
    }
}