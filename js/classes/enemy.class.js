
import Mobile from './mobile.class.js';
import Chicken from './chicken.class.js';
// import Endboss from './endboss.class.js';

import { arrIntervals } from "../game.js";

import { playSound, loadArray } from '../library.js';
import { FPS, CANVAS_WIDTH } from '../const.js';

export default class Enemy extends Mobile {
    name = '';
    key = '';
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
    energy = 100;
    damage = 0;

    arrAnimation;
    animationID = undefined;
    moveID = undefined;

    constructor (level, name, index = 0) { 
        super();
        this.name = name + index;
        this.level = level;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd;        
        this.initialize(this);
        this.animate();
        arrIntervals.push(this.moveID, this.animationID);
    }; 

    initialize (thisClass) {
        this.type = thisClass;
        if (thisClass instanceof Chicken) this.initChicken();
        // if (thisClass instanceof Endboss) this.initEndboss();
        

    }

    animate () {
        let speed = Math.random() * 0.25,
            startFromX = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd,
            startFromY = 380 + Math.random() * 10;

        if (this.isAlive) {
            this.moveID = this.move('left', speed, startFromX, startFromY);

            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation, 'wlk');          
            }, 12000 / FPS);
        } 
    }

    isAlive () {
        return this.damage > 0;
    }

    remove (key = '_die0', keepShowing = true) {
        clearInterval(this.animationID);
        clearInterval(this.moveID);
        this.animationID = undefined;
        this.moveID = undefined;
        this.damage = 0;
        this.energy = 0;
        this.speed = 0;
        this.height = 70;
        this.width = 70; 
        // used to display a dead enemy (i.e chicken)     
        if (keepShowing) this.loadImage(this.imageCache[this.name + key].src);
    }

    initChicken () {
        this.loadImage ('./img/Chicken/adult/wlk0.png');
        this.arrAnimation = loadArray ('./img/Chicken/adult/wlk', 3);
        this.loadImageCache (this.arrAnimation, this.name + '_wlk');
        this.loadImageCache (['./img/Chicken/adult/dead.png'], this.name + '_die');
        this.loadImageCache (['./img/Chicken/adult/egg.png'], this.name + '_egg');

        this.X = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd;
        this.speed = 0.15 + Math.random();
    }

    initEndboss() {
        this.loadImage ('./img/Endboss/walking/step1.png');
        this.arrAnimation = loadArray ('./img/Endboss/walking/step', 4);

        this.X = this.level.eastEnd;
        this.speed = 0.15 + Math.random() * 0.5;
    }

}