/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateGameStatus, gameOver, arrIntervals, arrAudio } from '../game.js';
import { playSound, loadArray } from '../library.js';
import {FPS ,CANVAS_HEIGHT, CANVAS_WIDTH , PEPE} from '../const.js';

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
    keyForChest = 0;
    seeds = 0;
    
    keyboard;
    cameraOffset = 150;
    arrWalking;
    arrJumping;
    arrHurt;
    arrSleeping;
    arrWaiting;
    arrDying;

    constructor (environment) {
        super().loadImage('./img/Pepe/idle/wait/wait0.png');
        this.environment = environment;
        this.keyboard = environment.keyboard;
        this.groundY = environment.groundY;
        this.Y = environment.groundY;
        this.initialize();           
        this.applyGravity();
        this.animate();
        console.log('Intervals: ' + arrIntervals )
    };

    initialize () {
        this.arrWalking = loadArray ('./img/Pepe/walk/wlk',6);
        this.loadImageCache (this.arrWalking, 'Pepe_wlk');
        this.arrJumping = loadArray ('./img/Pepe/jump/jmp',9);
        this.loadImageCache (this.arrJumping, 'Pepe_jmp');
        this.arrHurt = loadArray ('./img/Pepe/hurt/hurt',4);
        this.loadImageCache (this.arrHurt, 'Pepe_hrt');
        this.arrSleeping = loadArray ('./img/Pepe/idle/sleep/slp',10); 
        this.loadImageCache (this.arrSleeping, 'Pepe_slp');
        this.arrWaiting = loadArray ('./img/Pepe/idle/wait/wait',10); 
        this.loadImageCache (this.arrWaiting, 'Pepe_wait');
        this.arrDying = loadArray ('./img/Pepe/killed/die',30);
        this.loadImageCache (this.arrDying, 'Pepe_die');
    }

    animate () {
        arrIntervals.push(setInterval (() => { 
            let step = this.speed * 125;
            if (this.keyboard.RIGHT) {
                if (this.X < this.environment.eastEnd - CANVAS_WIDTH + this.cameraOffset - 10) {
                    this.X += step;
                    this.isMirrored = false;
                    this.setMoveTimeStamp();
                    // playSound('walking1.mp3');
                }                
            }

            if (this.keyboard.LEFT) {
                if (this.X > this.environment.westEnd + this.cameraOffset + 10) {
                this.X -= step;
                this.isMirrored = true;
                this.setMoveTimeStamp();
            }
            }
            
            if (this.keyboard.UP && !this.isAboveGround()) {
                this.setMoveTimeStamp();
                let power = Math.round(this.jumpPower / 6.75);
                if (power > 15) power = 15;
                this.jump(power);
                this.jumpPower -= this.environment.levelNo / 10;
                if (this.jumpPower < 0) this.jumpPower = 0;
                updateGameStatus(this);
            }
            if (this.X > this.environment.westEnd - this.cameraOffset) {
                this.environment.camera_X = -this.X + this.cameraOffset;
            }
            // this.environment.camera_X = -this.X + this.cameraOffset;
        }, 15)); //, 1000 / FPS

        arrIntervals.push(setInterval(() => {
            if (this.isDead()) {
                if (this.timeElapsed(this.diedAt) < 2.5) {    
                    this.playAnimation (this.arrDying,'die');
                } else {
                    gameOver(true);
                }  
            } else if (this.isHurt()) {
                this.playAnimation (this.arrHurt,'hrt');
                this.setMoveTimeStamp ()
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation (this.arrJumping,'jmp');
            } else if (this.keyboard.RIGHT || this.keyboard.LEFT) {
                this.playAnimation (this.arrWalking);    
            } else if (this.isSleeping()) {
                this.playAnimation(this.arrSleeping,'slp');              
            } else {
                this.playAnimation(this.arrWaiting,'wait');
            }
        }, 6000 / FPS));
    }

    /**
     * saving time stamp since last move
     */
    setMoveTimeStamp () {
        this.lastMove = new Date().getTime();
    }

    updateProperties (srcObject) {
        if (srcObject.visible) {
        // if (this.coins > 0 && srcObject.visible) {
            
            // still enough money?
            if (this.coins - srcObject.price >= 0) {
                playSound('plopp.mp3');
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
                playSound ('coin click.mp3');
                this.coins += item.value;
                this.score ++;
                item.enabled(false);
            } else if (item.type == 'bottle') {
                playSound ('bottle collected.mp3');
                this.bottles++;
                this.score = this.score + 2;
                item.enabled(false);                
            }
        }
    }

    updateStatus () {
        //
    }

    parseFoundItem (itemName) {
        let value = parseInt(itemName.replace(/[^0-9]/g,'')),
            name = itemName.replace(/[0-9]/g, '');

        switch (name) {
            case 'key':
                if (this.keyForChest <= this.environment.levelNo) this.keyForChest++;
                break;
            case 'coin':
                this.coins += value;
                break;
            case 'bullet':
                if (this.bullets <= this.environment.levelNo * 6) this.bullets++;        
                break;
            case 'food':
                this.jumpPower += value / 2;
                this.energy += value; 
                break;
            case 'medicine':
                this.energy += value * 10;
                break;
            case 'drink':
                this.accuracy += (value - 2) * 5;
                this.energy += value / 2;        
                break;
            case 'chilli':
                this.sharpness += (value - 2) * 5;
                this.jumpPower += Math.round(value / 4);        
                break;
            case 'seed':
                this.seeds += value;
                break;        
            default:
                break;
        } 
        this.score ++;
    }
}