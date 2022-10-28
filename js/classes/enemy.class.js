import Mobile from './mobile.class.js';
import { Intervals } from "../game.js";
import { FPS, CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';
import { gameSettings } from '../settings_mod.js';

export default class Enemy extends Mobile {
    name = '';
    type = undefined;
    level = 0;    
    height = 0;
    width = 0;
    defaultSpeed = 0.15;
    eastEnd = undefined;
    westEnd = undefined;
    isBackground = false;
    onCollisionCourse = true;
    isFriendly = gameSettings.enemiesOff; 
    energy = 100;
    damage = 0;

    arrAnimation = []; 
    animationID = undefined;
    moveID = undefined;


    constructor(level, name, index) { 
        super();
        this.name = name + index;
        this.type = name.toLowerCase();
        // because of chicklet's parent names we must check this...
        if (this.type.includes('chicklet')) this.type = 'chicklet'; 
        this.level = level;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd;   
        this.speed = this.defaultSpeed + Math.random() * 0.85;     
    }; 


    animate(animationKey, $this, milliseconds = 12000) {
        if (this.isAlive) {
            this.move (this, 'left');
            Intervals.add (
                function animation() {
                    $this.playAnimation($this.arrAnimation, animationKey)
                }, milliseconds / FPS, $this
            );
        } 
    }


    setPosition(size) {
        this.height += size;
        this.Y = 430 - Math.random() * this.height;
        let west = this.fivty50 ? -1 : 1;
        this.X = random(350, this.eastEnd - CANVAS_WIDTH * 0.8) * west;    
        this.onCollisionCourse = this.bottom >= 430 && this.bottom <= 460;
        this.isBackground = size <= 12 && !(this.onCollisionCourse) ? true : false;
        if (this.isBackground) {
            this.Y -= 50;
            this.height -= size * 2.5;
            this.width -= size * 2;
        } 
    }


    remove() {
        if (this.type == 'bees') return;
        this.animationID = clearInterval(this.animationID);
        this.moveID = clearInterval(this.moveID);
        Intervals.remove(this.name);
        this.damage = 0;
        this.energy = 0;
        this.speed = 0; 
        this.resizeEnemy(this.type);    
        this.loadImage(this.imageCache[this.name + '_dead'].src);
    }

    
    resizeEnemy(type) {
        switch (type) {
            case 'chicken':
                this.height = 70;
                this.width = 70;
                this.Y = 380;
                break;
            case 'endboss':
                this.height = 70;
                this.width = 70; 
                this.Y = 380;           
                break;
            default: // spiders & scorpions...
                this.height = 30;
                this.width = 70;
                this.Y = 430;
                break;
        }
    }
}