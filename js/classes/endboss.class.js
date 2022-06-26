import Mobile from "./mobile.class.js";
import { FPS } from '../const.js';
import { playSound, loadArray } from "../library.js";
import { arrIntervals } from "../game.js";

const CLS_NAME = 'Gallina';

export default class Endboss extends Mobile {
    name = '';
    level;
    height= 400;
    width= 350;
    X = undefined;
    Y = 60;
    eastEnd = undefined;
    westEnd = undefined;    
    isBackground = false;
    onCollisionCourse = true;
    energy = 100;
    damage = 0;

    arrAttack;
    arrAlert;
    arrDying;    
    arrWalking;    

    animationID = undefined;
    moveID = undefined;

    constructor (level, index = 0) { 
        super().loadImage('./img/Endboss/walking/step1.png');
        this.name = CLS_NAME + index;
        this.level = level;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd; 
        this.X = level.eastEnd - this.width;
        this.damage = level.levelNo * 5;
        this.speed = 0.15 + Math.random() * 0.5;
        this.initialize();
        this.animate();
        arrIntervals.push(this.moveID, this.animationID);
    };   

    initialize () {
        this.arrWalking = loadArray ('./img/Endboss/walking/step', 4);
        this.loadImageCache (this.arrWalking, this.name + '_step');
        this.arrAttack = loadArray ('img/Endboss/attack/attack/att',8);
        this.loadImageCache (this.arrAttack, this.name + '_att');
        this.arrDying = loadArray ('img/Endboss/dead/die',3);
        this.loadImageCache (this.arrDying, this.name + '_die');
        this.arrAlert = loadArray ('img/Endboss/attack/alert/alt', 8);
        this.loadImageCache (this.arrAlert, this.name + '_alt');
    }

    animate () {
        let random = Math.random() * 0.25,
            startFromX = 250 + Math.random() * 720 + 1,
            startFromY = 380 + Math.random() * 10;
        this.moveID = this.move('left', random, startFromX, startFromY);

        this.animationID = setInterval(() => {
            this.playAnimation(this.arrWalking,'step');         
        }, 9500 / FPS);
    }
    
    isAlive () {
        return this.damage > 0;
    }
}