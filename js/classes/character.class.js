/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateStatus } from "../game.js";
import { playSound, loadArray } from "../library.js";
import {FPS ,CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';

export default class Character extends Mobile {
    name = 'Pepe';
    environment; // reference to the world
    X = 50;
    Y = 150;
    groundY = 0;
    height = 300;
    width = 150;

    energy = 100;
    jumpPower = 11;
    sharpness = 40;
    accuracy = 50;
    coins = 0;
    bottles = 0;
    bullets = 0;
    gun = false;
    
    keyboard;
    cameraOffset = 150;
    arrWalking;
    arrJumping;
    arrHurt;
    arrSleeping;
    arrDying;

    constructor (environment) {
        super().loadImage('./img/Pepe/idle/IDLE/0.png');
        this.environment = environment;
        this.keyboard = environment.keyboard;
        this.groundY = environment.groundY;
        this.Y = environment.groundY;
        // this.bottom = this.Y + this.height;
        this.initialize();           
        this.applyGravity();
        this.animate();
    };

    initialize () {
        this.arrWalking = loadArray ('./img/Pepe/walk/wlk',5);
        this.loadImageCache (this.arrWalking, this.name + '_wlk');
        this.arrJumping = loadArray ('./img/Pepe/jump/jmp',9);
        this.loadImageCache (this.arrJumping, this.name + '_jmp');
        this.arrHurt = loadArray ('./img/Pepe/hurt/hurt',3);
        this.loadImageCache (this.arrHurt, this.name + '_hrt');
        this.arrDying = loadArray ('./img/Pepe/killed/die',7);
        this.loadImageCache (this.arrDying, this.name + '_die');
        console.log(this.name + 'Bottom: ' + this.bottom() + '| Right: ' + this.right())
    }

    animate () {
        setInterval (() => { 
            let step = this.speed * 125;
            if (this.keyboard.RIGHT && this.X < this.environment.eastEnd - CANVAS_WIDTH + this.cameraOffset - 10) {
                this.X += step;
                this.isMirrored = false;
                // playSound('walking1.mp3');
                // console.log('Pepe >>, X = ' + this.X);
            }

            if (this.keyboard.LEFT && this.X > this.environment.westEnd + this.cameraOffset + 10) {
                this.X -= step;
                this.isMirrored = true;
                // console.log('Pepe <<, X = ' + this.X);
            }

            if (this.keyboard.UP && !this.isAboveGround()) {
                let power = this.jumpPower < 15 ? this.jumpPower : 15;
                this.jump(power);
                this.jumpPower -= this.environment.lvlNumber/10;
                if (this.jumpPower < 0) this.jumpPower = 0;
                updateStatus(this);
            }

            this.environment.camera_X = -this.X + this.cameraOffset;
        }, 1000 / FPS);

        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation (this.arrHurt,'hrt');
            } else if (this.isDead()) {
                this.playAnimation (this.arrDying,'die');
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation (this.arrJumping,'jmp');
            } else if (this.keyboard.RIGHT || this.keyboard.LEFT) {
                this.playAnimation (this.arrWalking);     
            }
        }, 6000 / FPS);
    }

    top () {
        return this.Y;
    }

    left () {
        return this.X;
    }

    bottom () {
        return this.Y + this.height;
    }

    right () {
        return this.X + this.width;
    }
}