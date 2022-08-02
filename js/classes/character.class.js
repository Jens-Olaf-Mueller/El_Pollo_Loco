/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateGameStatus, gameOver, arrIntervals, Sounds } from '../game.js';
import { loadSettings, saveSettings, gameSettings } from '../settings_mod.js';
import { loadArray, random } from '../library.js';
import {FPS ,CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Character extends Mobile {
    name = 'Pepe';
    type = 'character';
    environment; // reference to the world
    lastMove = new Date().getTime(); // time elapsed since Pepe has moved (requ. for sleep animation)
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
    arrAnimation = [];

    constructor (environment) {
        super().loadImage('./img/Pepe/idle/wait/wait0.png');
        this.environment = environment;
        this.keyboard = environment.keyboard;
        this.groundY = environment.groundY;
        this.Y = environment.groundY;
        this.initialize();           
        arrIntervals.push(this.applyGravity());
        this.animate();
    };

    initialize () {
        this.arrAnimation.push(...loadArray('./img/Pepe/walk/wlk',6));
        this.arrAnimation.push(...loadArray('./img/Pepe/jump/jmp',9));
        this.arrAnimation.push(...loadArray('./img/Pepe/hurt/hurt',4));
        this.arrAnimation.push(...loadArray('./img/Pepe/idle/sleep/slp',10));
        this.arrAnimation.push(...loadArray('./img/Pepe/idle/wait/wait',10));
        this.arrAnimation.push(...loadArray('./img/Pepe/killed/die',30));
        this.loadImageCache (this.arrAnimation, this.name);
        this.loadSettings();
    }

    loadSettings () {
        this.score = gameSettings.score || 0;
        this.energy = gameSettings.energy || 50;        
        this.jumpPower = gameSettings.jumpPower || 70;
        this.sharpness = gameSettings.sharpness || 40;
        this.accuracy = gameSettings.accuracy || 50;
        this.coins = gameSettings.coins || 0;
        this.bottles = gameSettings.bottles || 0;        
        this.bullets = gameSettings.bullets || 0;
        this.gun = gameSettings.gun || false;
        this.keyForChest = gameSettings.keyForChest || 0;
        this.seeds = gameSettings.seeds || 0;
        if (gameSettings.debugMode) {
            if (gameSettings.debugBottles) this.bottles = gameSettings.debugBottles;
            if (gameSettings.debugSeeds) this.seeds = gameSettings.debugSeeds;
            if (gameSettings.debugBullets) this.bullets = gameSettings.debugBullets;
            if (gameSettings.debugGun) this.gun = true;
        } 

    }

    animate () {
        arrIntervals.push(setInterval (() => { 
            Sounds.stop('walk');
            if (this.keyboard.RIGHT) this.walk('right');
            if (this.keyboard.LEFT) this.walk('left');
            if (this.keyboard.UP && !this.isAboveGround()) this.jump();

            this.environment.camera_X = -this.X + this.cameraOffset;
            // if (this.X > this.environment.westEnd - this.cameraOffset) {
            //     this.environment.camera_X = -this.X + this.cameraOffset;
            // }           
        }, 1000 / FPS)); // 16 ms
        arrIntervals.push(this.runAnimationInterval()); 
    }

    runAnimationInterval () {
        return setInterval (() => {
            if (this.isDead()) {
                if (this.timeElapsed(this.diedAt) < 2.5) {    
                    this.playAnimation (this.arrAnimation,'die');
                } else {
                    gameOver();
                }  
            } else if (this.isHurt()) {
                this.playAnimation (this.arrAnimation,'hurt');
                this.setNewTimeStamp();
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation (this.arrAnimation,'jmp');
            } else if (this.keyboard.RIGHT || this.keyboard.LEFT) {
                this.playAnimation (this.arrAnimation,'wlk');    
            } else if (this.isSleeping()) {
                this.playAnimation(this.arrAnimation,'slp');              
            } else {
                this.playAnimation(this.arrAnimation,'wait');
            }
        }, 6000 / FPS); // 60 ms
    }

    walk (direction) {
        Sounds.play('walk');
        let step = (direction == 'right') ? 18 : -18;
        if (direction == 'right') {
            if (this.X < this.environment.eastEnd - CANVAS_WIDTH + this.cameraOffset - 10) this.X += step;
        } else if (direction == 'left') {
            if (this.X > this.environment.westEnd + this.cameraOffset + 10) this.X += step;
        }
        this.isMirrored = (direction == 'left');
        this.setNewTimeStamp();        
    }

    jump () {
        Sounds.play('jump');
        let power = Math.round(this.jumpPower / 6.75);
        if (power > 15) power = 15;
        this.speedY = -power;
        this.jumpPower -= this.environment.levelNo / 5;
        if (this.jumpPower < 0) this.jumpPower = 0;        
        updateGameStatus(this);
        this.setNewTimeStamp();        
    }

    hitSuccessful () {
        return random(1,100) <= this.accuracy;
    }

    throwBottle () {
        this.environment.bottle.throw(this.X + this.width / 2, this.Y + this.height / 2, 15, this.isMirrored);
        this.bottles--;
        this.setNewTimeStamp();
    }

    canShoot () {
        return this.gun && this.bullets > 0;
    }    

    shoot () {
        Sounds.play('gun');
        Sounds.play('shot');
        this.bullets--;
        this.setNewTimeStamp();
        // hier Accuracy und Trefferquote berechnen & returnieren...!!!
        return 10;
    }

    /**
     * saving time stamp since last action
     */
    setNewTimeStamp () {
        this.lastMove = new Date().getTime();
    }

    updateProperties (item) {
        if (item.visible) {
            // still enough money left?
            if (this.coins - item.price >= 0 || item.type == 'beehive') {
                Sounds.play('plopp');
                this.energy += parseInt(item.energy);
                this.accuracy += parseInt(item.accuracy);
                this.jumpPower += parseInt(item.jumpPower);
                this.sharpness += parseInt(item.sharpness);            
                this.coins -= item.price;
                this.adjustProperties(1);
                item.enabled(false);
            } else {
                Sounds.play('money');
            }   
        }
    }

    buyItems () {        
        let price = parseInt((1 + Math.random() * 100) * this.environment.levelNo * 10),
            enoughMoney = false, amount;
        if (this.energy < 50) {
            amount = parseInt(120 - this.energy);
            enoughMoney = (this.coins >= price);
            if (enoughMoney) this.parseFoundItem('medicine' + amount);
        } else if (this.gun == false) {
            price = this.environment.levelNo * 1000;
            enoughMoney = (this.coins >= price);
            if (enoughMoney) this.parseFoundItem('gun');
        } else if (this.gun && this.bullets < 6) {
            amount = parseInt(6 - this.bullets);
            enoughMoney = (this.coins >= price);
            if (enoughMoney) this.parseFoundItem('bullet' + amount); 
        }

        if (enoughMoney) {
            Sounds.play('kaching');
        } else {
            price = 0;
        }
        this.coins -= price;
    }

    updateItems (item, bonus) {
        if (item.visible) {
            if (item.type == 'coin') {
                Sounds.play('coin');
                this.coins += item.value;
                this.score ++;
                item.enabled(false);
            } else if (item.type == 'bottle' && this.bottles < 10) {
                Sounds.play('bottle');
                this.bottles++;
                this.score += 2;
                item.enabled(false);                
            }
        }

        if (bonus) {
            Sounds.play('found');
            this.environment.bonus.animate(item.X, item.Y);
            item.contains = null;
            if (item.type == 'chest') {
                this.keyForChest--;
                if (this.keyForChest < 0) this.keyForChest = 0;
            }
            this.parseFoundItem(bonus);
            console.log(bonus + ' gefunden...');
        }  
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
            case 'gun':
                this.gun = true;
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
            case 'chili':
                this.sharpness += (value - 2) * 5;
                this.jumpPower += Math.round(value / 4);        
                break;
            case 'seed':
                this.seeds += value;
                break;        
            default:
                break;
        } 
        this.adjustProperties(this.environment.levelNo * 10);
    }

    adjustProperties(score) {
        this.score += score;
        if (this.energy > 120) this.energy = 120;
        if (this.accuracy > 100) this.accuracy = 100; 
        if (this.sharpness > 120) this.sharpness = 120;  
        if (this.jumpPower > 105) this.jumpPower = 105;
    }
}