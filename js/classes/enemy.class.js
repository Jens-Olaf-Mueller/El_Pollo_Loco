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
    X = undefined;
    Y = undefined;
    defaultSpeed = 0.15;
    eastEnd = undefined;
    westEnd = undefined;
    isBackground = false;
    onCollisionCourse = true;
    isFriendly = gameSettings.enemiesOff; 
    energy = 100;
    damage = 0;

    // get isAlive() {return this.energy > 0;}

    arrAnimation = []; 
    animationID = undefined;
    moveID = undefined;

    constructor (level, name, index) { 
        super();
        this.name = name + index; 
        this.type = name.toLowerCase();
        this.level = level;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd;   
        this.speed = this.defaultSpeed + Math.random() * 0.85;     
    }; 

    animate (animationKey, $this, milliseconds = 12000) {
        if (this.isAlive) {
            this.move (this, 'left');
            Intervals.add (
                function enemyAnimation() {
                    $this.playAnimation($this.arrAnimation, animationKey)
                }, milliseconds / FPS, [$this]
            );
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

    // isAlive () {
    //     return this.energy > 0;
    // }

    remove () {
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

    resizeEnemy (type) {
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