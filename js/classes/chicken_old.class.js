/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import { FPS, CANVAS_WIDTH } from '../const.js';
import { playSound, loadArray } from "../library.js";

export default class Chicken_old extends Mobile {
    name = '';
    type = 'frida';
    key;
    level = 0;
    isBackground = false;
    onCollisionCourse = true;
    X = 0; 
    Y = 380;
    height = 60;
    width = 60;
    right = this.X + this.width;
    eastEnd = 0;     
    damage = 2;   
    arrWalking = [];
    intervalID = 0;
    moveID = 0;

    constructor (level, index) { 
        super().loadImage('./img/Chicken/adult/wlk0.png');
        this.level = level;
        this.eastEnd = level.eastEnd - CANVAS_WIDTH / 2;
        this.damage = level.levelNo + 1;
        this.name = 'Frida' + index;
        this.initialize();
        this.animate();
    };   

    initialize () {
        this.arrWalking = loadArray ('./img/Chicken/adult/wlk', 3);
        this.loadImageCache (this.arrWalking, this.name + '_wlk');
        this.loadImageCache (['./img/Chicken/adult/dead.png'], this.name + '_die');
        this.loadImageCache (['./img/Chicken/adult/egg.png'], this.name + '_egg');

        this.X = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd;
        this.speed = 0.15 + Math.random();
    }

    animate () {
        let speed = Math.random() * 0.25,
            startFromX = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd,
            startFromY = 380 + Math.random() * 10;

        if (this.isAlive) {
            this.moveID = this.move('left', speed, startFromX, startFromY);
            this.intervalID = setInterval(() => {
                this.playAnimation(this.arrWalking,'wlk');          
            }, 12000 / FPS);
        } 
    }

    isAlive () {
        return this.damage > 0;
    }

    remove () {
        clearInterval(this.intervalID);
        clearInterval(this.moveID);
        this.damage = 0;
        this.speed = 0;
        this.height = 70;
        this.width = 70;        
        let key = this.name + '_die0';             
        this.image.src = this.imageCache[key].src;
    }
}