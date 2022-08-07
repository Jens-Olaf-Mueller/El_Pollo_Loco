/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateGameStatus, gameOver, Sounds, Intervals } from '../game.js';
import { loadSettings, saveSettings, gameSettings } from '../settings_mod.js';
import { loadArray, random } from '../library.js';
import {FPS ,CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Character extends Mobile {
    name = 'Pepe';
    type = 'character';
    environment;                     // reference to the world
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
        this.startIntervals(this);
        this.applyGravity(this);
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

    /**
     * adds the 'move' and 'animation'-interval to the interval-listener class.
     * since 'this' would not work inside another class, 
     * we pass the current class as 'Me'
     * @param {object} Me ist the instance of 'this'
     */
    startIntervals (Me) {
        Intervals.add (
            function move() {
                Sounds.stop('walk');
                if (Me.keyboard.RIGHT) Me.walk('right');
                if (Me.keyboard.LEFT) Me.walk('left');
                if (Me.keyboard.UP && !Me.isAboveGround()) Me.jump();
    
                Me.environment.camera_X = -Me.X + Me.cameraOffset;
                // if (Me.X > Me.environment.westEnd - Me.cameraOffset) {
                //     Me.environment.camera_X = -Me.X + Me.cameraOffset;
                // } 
            }, 1000 / FPS, [Me] // = 16 ms
        )
        
        Intervals.add (
            function animate () {
                if (Me.isDead()) {
                    if (Me.timeElapsed(Me.diedAt) < 2.25) {    
                        Me.playAnimation (Me.arrAnimation,'die');
                    } else {
                        gameOver();
                    }  
                } else if (Me.isHurt()) {
                    Me.playAnimation (Me.arrAnimation,'hurt');
                    Me.setNewTimeStamp();
                } else if (Me.isAboveGround() || Me.speedY > 0) {
                    Me.playAnimation (Me.arrAnimation,'jmp');
                } else if (Me.keyboard.RIGHT || Me.keyboard.LEFT) {
                    Me.playAnimation (Me.arrAnimation,'wlk');    
                } else if (Me.isSleeping()) {
                    Me.playAnimation(Me.arrAnimation,'slp');              
                } else {
                    Me.playAnimation(Me.arrAnimation,'wait');
                }
            }, 6000 / FPS, [Me] // = 100 ms
        )
    }

  /**
   * executes a walk of the character
   * @param {string} direction  determines if we walk to left or right
   * @param {number} step pixels to be moved in 'direction'
   */
    walk (direction, step = 18) {
        Sounds.play('walk');
        step = (direction == 'right') ? step : -step;
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

    /**
     * determine if a hit was succesful, depending on the character's current accuracy
     * @returns true | false
     */
    hitSuccessful () {
        return random(1, 100) <= this.accuracy;
    }

    /**
     * executes a bottle-throw and reduces the character's bottles
     */
    throwBottle () {
        this.environment.bottle.throw(this.X + this.width / 2, this.Y + this.height / 2, 15, this.isMirrored);
        this.bottles--;
        this.setNewTimeStamp();
    }

    /**
     * check if we can execute a shot.
     * must be a gun and bullets available
     * @returns true | false
     */
    canShoot () {
        return this.gun && this.bullets > 0;
    }    

    /**
     * executes a shot, reduces the character's bullets and plays the concerning sounds
     */
    shoot () {
        Sounds.play('gun');
        Sounds.play('shot');
        this.bullets--;
        this.setNewTimeStamp();
    }

    /**
     * saving time stamp since last action
     */
    setNewTimeStamp () {
        this.lastMove = new Date().getTime();
    }

    /**
     * update the caracter's properties, depending on the given item.
     * plays the correspondending sound
     * @param {object} item 
     */
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

    /**
     * character buys either medicine, a gun or bullets, 
     * according to the priotity list of the shop
     */
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

    /**
     * update the character's collected bottles and coins
     * @param {object} item bottle or coin item
     * @param {object} bonus item found in a jar or chest
     */
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
        // handling an eventual bonus item
        if (bonus) {
            Sounds.play('found');
            this.environment.bonus.animate(item.X, item.Y);
            item.contains = null;
            if (item.type == 'chest') {
                this.keyForChest--;
                if (this.keyForChest < 0) this.keyForChest = 0;
            }
            this.parseFoundItem(bonus);
            if (gameSettings.debugMode) console.log(bonus + ' found...');
        }  
    }

    /**
     * parses a found item and updates the character's belongings or properties
     * @param {string} itemName the name of the found item including it's value
     */
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

    /**
     * make sure the character's properties are in the correct range
     * and updates the scores
     * @param {number} score update player's score
     */
    adjustProperties(score) {
        this.score += score;
        if (this.energy > 120) this.energy = 120;
        if (this.accuracy > 100) this.accuracy = 100; 
        if (this.sharpness > 120) this.sharpness = 120;  
        if (this.jumpPower > 105) this.jumpPower = 105;
    }
}