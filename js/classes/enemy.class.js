import Mobile from './mobile.class.js';
import { arrIntervals } from "../game.js";
import { FPS, CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';

export default class Enemy extends Mobile {
    name = '';
    type = undefined;
    level = 0;    
    height = 0;
    width = 0;
    X = undefined;
    Y = undefined;
    eastEnd = undefined;
    westEnd = undefined;
    isBackground = false;
    onCollisionCourse = true;
    isFriendly = false; 
    energy = 100;
    damage = 0;

    arrAnimation = []; 
    animationID = undefined;
    moveID = undefined;

    constructor (level, name, index = 0) { 
        super();
        this.name = name + ' ' + index; // ' ' = SHIFTSPACE [ALT+0160]
        this.type = name.toLowerCase();
        this.level = level;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd;        
    }; 

    animate (animationKey) {
        let speed = Math.random() * 0.25,
            startFromX = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd,
            startFromY = 380 + Math.random() * 10;
            // debugger

        if (this.isAlive) {
            this.moveID = this.move('left', speed, startFromX, startFromY);

            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation, animationKey);                 
            }, 12000 / FPS);
            arrIntervals.push(this.moveID, this.animationID);
        } 
    }

    setPosition(size) {
        this.height += size;
        this.Y = 430 - Math.random() * this.height;
        let range = this.Y + this.height, 
            west = Math.random() > 0.5 ? -1 : 1;
        this.X = random(350, this.eastEnd - CANVAS_WIDTH * 0.8) * west;    
        this.onCollisionCourse = range >= 430 && range <= 460;
        this.isBackground = size <= 12 && !(this.onCollisionCourse) ? true : false;
        
        if (this.isBackground) {
            this.Y -= 50;
            this.height -= size * 2.5;
            this.width -= size * 2;
        } 
    }

    isAlive () {
        return this.energy > 0;
    }

    remove (displayImage) {
        // if (this.type == 'endboss' || this.type == 'bees') return;
        if (this.type == 'bees') return;
        this.animationID = clearInterval(this.animationID);
        this.moveID = clearInterval(this.moveID);
        this.damage = 0;
        this.energy = 0;
        this.speed = 0; 
        this.resizeEnemy(this.type);

        // if (this.type == 'chicken') {
        //     this.height = 70;
        //     this.width = 70;
        //     this.Y = 380;
        // } else if (this.type == 'endboss') {
        //     this.height = 200;
        //     this.width = 175; 
        //     this.Y = 260;
        // } else {
        //     this.height = 30;
        //     this.width = 70;
        //     this.Y = 430;
        // }        
        // used to display a dead enemy (i.e chicken)     
        if (displayImage) this.loadImage(this.imageCache[this.name + '_' + displayImage].src);
    }

    resizeEnemy (type) {
        switch (type) {
            case 'chicken':
                this.height = 70;
                this.width = 70;
                this.Y = 380;
                break;
            case 'endboss':
                this.height = 200;
                this.width = 175; 
                this.Y = 260;           
                break;
            default: // spiders & scorpions...
                this.height = 30;
                this.width = 70;
                this.Y = 430;
                break;
        }
    }
}