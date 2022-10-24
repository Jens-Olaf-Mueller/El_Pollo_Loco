import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Obstracle extends Background {
    name = '';
    type = '';
    level;
    value = 0;
    visible = false;
    isBackground = false;
    onCollisionCourse = false;
    canJumpOn = false;
    damage = 0;
    height = 50;
    width = 50;
    eastEnd;
    westEnd;
    X = Infinity;
    Y = Infinity;

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
            let bgSize = random(1, 30), west = Math.random() > 0.5;
            this.height += bgSize;
            this.X = random (350, this.eastEnd - CANVAS_WIDTH * 0.8); 
            this.X = west ? -this.X : this.X;
            this.Y = 430 - Math.random() * this.height;
            let bgRange = this.Y + this.height;
            this.onCollisionCourse = bgRange >= 430 && bgRange <= 460;

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
        this.damage = 0.1;
    }

    setStoneProperties () {
        if (this.name == 'stone_big0') this.onCollisionCourse = false; // never colliding!
        this.Y = this.isBackground ? 280 : 330;
        this.height = 150;
        this.width = 150;
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

    // remove () {
    //     if (this.type == 'spider' || this.type == 'scorpion') {
    //         // clearInterval(this.animationID);
    //         // clearInterval(this.moveID);
    //         // this.animationID = undefined;
    //         // this.moveID = undefined;
    //         this.damage = 0;
    //         // this.energy = 0;
    //         // this.speed = 0;
    //         this.height = 50;
    //         this.width = 50; 
    //         this.Y = 420;    
    //         this.loadImage('./img/Items/Bottles/splash_salsa/splash3.png');
    //     }
    // }
}