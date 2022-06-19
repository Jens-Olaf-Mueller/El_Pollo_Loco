import Mobile from "./mobile.class.js";
import { FPS } from '../const.js';
import { playSound, loadArray } from "../library.js";

export default class Endboss extends Mobile {
    name = 'Senora Gallina';
    height= 400;
    width= 350;
    X = 720;
    Y = 60;
    energy = 100;
    damage = 5;
    arrWalking = [];

    constructor (startX) { 
        super().loadImage('./img/Endboss/walking/step1.png');
        this.X = startX;
        this.speed = 0.15 + Math.random() * 0.5;
        this.initialize();
        this.animate();
    };   

    initialize () {
        this.arrWalking = loadArray ('./img/Endboss/walking/step', 4);
        this.loadImageCache (this.arrWalking, this.name + '_step');
    
    }

    animate () {
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