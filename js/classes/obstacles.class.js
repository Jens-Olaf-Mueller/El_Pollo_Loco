import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Obstacle extends Background {
    X = Infinity;
    Y = Infinity;
    name = '';
    type = '';
    level;
    value = 0;
    visible = false;
    isBackground = false;
    onCollisionCourse = false;
    canJumpOn = false;
    jumpTop = 0;
    damage = 0;
    height = 50;
    width = 50;

    constructor (imgPath, name, level) { 
        super().loadImage(imgPath);
        this.name = name;
        this.value = parseInt(name.replace(/[^0-9]/g,'')) || 0; // returns only a number from string!
        this.type = name.replace(/[0-9]/g, '');
        this.level = level;
        this.eastEnd = level.eastEnd || CANVAS_WIDTH;  
        this.westEnd = -this.eastEnd || -CANVAS_WIDTH;   
        this.initialize();
    };   


    initialize () {
        this.visible = random(0, 100) > 50 ? true : false;
        if (this.visible) {
            const bgSize = random(1, 30);
            this.height += bgSize;
            this.X = random (350, this.eastEnd - CANVAS_WIDTH * 0.8); 
            this.X = this.fivty50 ? -this.X : this.X;
            this.Y = 430 - Math.random() * this.height;
            this.onCollisionCourse = this.bottom >= 430 && this.bottom <= 460;

            this.setBackground(bgSize);           
            if (this.name.includes('tree')) this.setTreeProperties();
            if (this.name.includes('stone')) this.setStoneProperties();
            if (this.name.includes('cactus')) this.setCactusProperties();                
            if (this.name.includes('bees')) this.setBeeProperties();
            if (this.name.includes('snake')) this.setDamage(((this.value + 1) / 2) * 10);            
            if (this.name.includes('scorpion')) this.setDamage(this.level.levelNo + this.value + 1);            
            if (this.name.includes('spider')) this.setDamage(this.level.levelNo);            
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
        // this.damage = 0.1;
    }

    setStoneProperties () {
        if (this.name == 'stone_big0') this.onCollisionCourse = false; // never colliding!
        this.Y = this.isBackground ? 275 : 325; // 280 : 330 old settings!
        this.height = 150;
        this.width = 150;
        this.jumpTop = this.name.includes('stone_big') ? 75 : 79;
        this.damage = 0.25;
        this.canJumpOn = this.onCollisionCourse;
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
    
    setDamage (toxic) {
        this.damage = toxic;
    }
}