import Mobile from './mobile.class.js';
import { FPS } from '../const.js';
import { Sounds } from '../game.js';
import { gameSettings } from '../settings_mod.js';
import { playSound, loadArray } from '../library.js';

export default class Seed extends Mobile {
    name = 'Seed';
    type = 'seed';
    height = 40;
    width = 55;
    X = 0;
    Y = -40;
    offsetY = 0;
    groundY = 380;
    speed = 8;
    speedY = 0.125; 
    acceleration = 0.125;
    visible = false;
    onCollisionCourse = true;
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;
    gravarityID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();      
    }

    initialize() {
        this.arrAnimation = loadArray ('./img/Seed/seed',4);
        this.loadImageCache (this.arrAnimation, this.name);
    }

    throw (pX, pY, speed, mirrored = false) {
        if( this.moveID == undefined) {
            Sounds.play('seed');
            this.X = pX;
            this.Y = pY;
            this.speedY = -speed;
            this.gravarityID = this.applyGravity();
            this.animationID = this.animate();            
            this.moveID = setInterval(() => {
                if (this.Y < this.groundY) {
                    let dir = mirrored ? -1 : 1;
                    this.X += this.speed * dir;
                } else if (this.Y >= this.groundY) {
                    this.hide();
                }            
            }, 25);
        }
    }

    animate () {      
        return setInterval(() => {
            this.playAnimation(this.arrAnimation,'seed');          
        }, 2000 / FPS);
    }
}