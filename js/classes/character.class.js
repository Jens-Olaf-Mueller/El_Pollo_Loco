/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateGameStatus } from "../game.js";
import { playSound, loadArray } from "../library.js";
import {FPS ,CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';

export default class Character extends Mobile {
    name = 'Pepe';
    environment; // reference to the world
    X = 50;
    Y = 150;
    groundY = 0;
    offsetY = 110;
    height = 300;
    width = 150;

    energy = 100;
    score = 0;
    jumpPower = 70;
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
        this.initialize();           
        this.applyGravity();
        this.animate();
    };

    initialize () {
        this.arrWalking = loadArray ('./img/Pepe/walk/wlk',5);
        this.loadImageCache (this.arrWalking, this.name + '_wlk');
        this.arrJumping = loadArray ('./img/Pepe/jump/jmp',9);
        this.loadImageCache (this.arrJumping, this.name + '_jmp');
        this.arrHurt = loadArray ('./img/Pepe/hurt/hurt',5);
        this.loadImageCache (this.arrHurt, this.name + '_hrt');
        this.arrDying = loadArray ('./img/Pepe/killed/die',30);
        this.loadImageCache (this.arrDying, this.name + '_die');
    }

    animate () {
        setInterval (() => { 
            let step = this.speed * 125;
            if (this.keyboard.RIGHT && this.X < this.environment.eastEnd - CANVAS_WIDTH + this.cameraOffset - 10) {
                this.X += step;
                this.isMirrored = false;
                // playSound('walking1.mp3');
            }

            if (this.keyboard.LEFT && this.X > this.environment.westEnd + this.cameraOffset + 10) {
                this.X -= step;
                this.isMirrored = true;
            }

            if (this.keyboard.UP && !this.isAboveGround()) {
                let power = Math.round(this.jumpPower / 6.75);
                if (power > 15) power = 15;
                this.jump(power);
                this.jumpPower -= this.environment.levelNo/10;
                if (this.jumpPower < 0) this.jumpPower = 0;
                updateGameStatus(this);
            }

            this.environment.camera_X = -this.X + this.cameraOffset;
        }, 1000 / FPS);

        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation (this.arrHurt,'hrt');
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation (this.arrJumping,'jmp');
            } else if (this.keyboard.RIGHT || this.keyboard.LEFT) {
                this.playAnimation (this.arrWalking);     
            }else if (this.isDead()) {
                this.playAnimation (this.arrDying,'die');
            } else {

            }
        }, 6000 / FPS);
    }

    updateProperties (srcObject) {
        if (this.coins > 0 && srcObject.visible) {
            // still enough money?
            if (this.coins - srcObject.price >= 0) {
                this.energy += parseInt(srcObject.energy);
                this.accuracy += parseInt(srcObject.accuracy);
                this.jumpPower += parseInt(srcObject.jumpPower);            
                this.sharpness += parseInt(srcObject.sharpness);            
                this.coins -= srcObject.price;
                this.score ++;
                srcObject.enabled(false);
            }    
        }
    }

    updateItems (item) {
        if (item.visible) {
            if (item.type == 'coin') {
                this.coins += item.value;
                this.score ++;
                item.enabled(false);
            } else if (item.type == 'bottle') {
                this.bottles++;
                this.score = this.score + 2;
                item.enabled(false);                
            }
        }
    }

    updateStatus () {

    }
}