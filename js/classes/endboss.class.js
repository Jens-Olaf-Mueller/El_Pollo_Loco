import Mobile from "./mobile.class.js";
import { FPS } from '../const.js';

export default class Endboss extends Mobile {
    constructor (startX) { 
        super().loadImage('./img/Endboss/walking/step1.png');
        this.loadImageCache(this.arrWalking, this.name + '_step');
        this.X = startX;
        this.speed = 0.15 + Math.random() * 0.5;
        this.walk();
    };   

    name = 'Senora Gallina';
    height= 400;
    width= 350;
    X = 720;
    Y = 60;
    energy = 100;
    damage = 5;
    imgIndex = 0;

    arrWalking = [
        './img/Endboss/walking/step0.png',
        './img/Endboss/walking/step1.png',
        './img/Endboss/walking/step2.png',
        './img/Endboss/walking/step3.png',
    ];

    walk () {
        let random = Math.random() * 0.25,
            startFromX = 250 + Math.random() * 720 + 1,
            startFromY = 380 + Math.random() * 10;
        this.move('left', random, startFromX, startFromY);

        setInterval(() => {
            this.playAnimation(this.arrWalking,'step');         
        }, 9500 / FPS);
    }
    
    isAlive () {
        return this.damage > 0;
    }
}