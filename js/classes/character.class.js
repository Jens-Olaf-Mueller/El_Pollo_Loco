/**
* in order to use the EXTENDED classes as module
* an extending or used class must be imported here!
*/
import Mobile from './mobile.class.js';
import { updateStatusbar, gameOver, Sounds, Intervals, flashElement } from '../game.js';
import { loadSettings, saveSettings, gameSettings } from '../settings_mod.js';
import $, { loadArray, random } from '../library.js';
import {FPS , GROUND, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Character extends Mobile {
    name = 'Pepe';
    type = 'character';
    environment;                    
    X = 50;
    Y = 150;
    offsetY = 110;        
    height = 300;
    width = 150;
    groundY = GROUND;

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

    get isInFrontOfShop() {
        return this.right > this.environment.level.shop.left + 50 && 
               this.left < this.environment.level.shop.right - 50;
    }

    /**
     * check if we can execute a shot.
     * must have a gun and bullets 
     * @returns {boolean} true | false
     */
    get canShoot() {
        return this.gun && this.bullets > 0;
    } 

    /**
     * determine if a hit was succesful, depending on the character's current accuracy
     * @returns true | false
     */
    get hitSuccessful () {
        return random(1, 100) <= this.accuracy;
    }

    constructor (environment) {
        super().loadImage('./img/Pepe/idle/wait/wait0.png');
        this.environment = environment;
        this.keyboard = environment.keyboard;
        this.Y = environment.groundY;
        this.initialize();
        this.startAnimations(this);
        this.applyGravity(this);
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
            if (gameSettings.dbgCoins) this.coins = +gameSettings.dbgCoins;
            if (gameSettings.dbgBottles) this.bottles = +gameSettings.dbgBottles;
            if (gameSettings.dbgSeeds) this.seeds = +gameSettings.dbgSeeds;
            if (gameSettings.dbgBullets) this.bullets = +gameSettings.dbgBullets;
            if (gameSettings.dbgGun) this.gun = true;
        } 
    }


    /**
     * adds the 'move' and 'animation'-interval to the interval-listener class.
     * since 'this' would not work inside another class, 
     * we pass the current class as '$this'
     * @param {object} $this ist the instance of 'this'
     */
    startAnimations($this) {
        Intervals.add(
            function move() {
                if (!$this.isDead) {
                    Sounds.stop('walk');
                    if ($this.keyboard.RIGHT) $this.walk('right');
                    if ($this.keyboard.LEFT) $this.walk('left');
                    if ($this.keyboard.UP && !$this.isAboveGround) $this.jump();
        
                    $this.environment.camera_X = -$this.X + $this.cameraOffset;
                    // if ($this.X > $this.environment.westEnd - $this.cameraOffset) {
                    //     $this.environment.camera_X = -$this.X + $this.cameraOffset;
                    // }                     
                }
            }, 1000 / FPS, $this // = 16 ms
        )
        
        Intervals.add(
            function animate() {
                if ($this.isDead) {
                    if ($this.timeElapsed($this.diedAt) < 2.25) {    
                        $this.playAnimation ($this.arrAnimation,'die');
                    } else {
                        gameOver();
                    }  
                } else if ($this.isHurt) {
                    $this.playAnimation ($this.arrAnimation,'hurt');
                    $this.setNewTimeStamp();
                } else if ($this.isAboveGround || $this.speedY > 0) {
                    $this.playAnimation ($this.arrAnimation,'jmp');
                } else if ($this.keyboard.RIGHT || $this.keyboard.LEFT) {
                    $this.playAnimation ($this.arrAnimation,'wlk');    
                } else if ($this.isSleeping) {
                    $this.playAnimation($this.arrAnimation,'slp');              
                } else {
                    $this.playAnimation($this.arrAnimation,'wait');
                }
            }, 6000 / FPS, $this // = 100 ms
        )
    }

  /**
   * executes a walk of the character
   * @param {string} direction  determines if we walk to left or right
   * @param {number} step pixels to be moved in 'direction'
   */
    walk(direction, step = 18) {
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


    /**
     * executes a jump of the character and reduces it's jump power
     * max. skip value should not be more than 15,
     * otherwise character jumps out of the screen!
     */
    jump() {
        if (this.jumpPower > 20) Sounds.play('jump');
        let skip = Math.round(this.jumpPower / 6.6666); // i.e. 100 / 6.6666 = 15!
        if (skip > 15) skip = 15;
        this.speedY = -skip;
        this.jumpPower -= this.environment.levelNo / 5;
        if (this.jumpPower < 0) this.jumpPower = 0;        
        updateStatusbar(this);
        this.setNewTimeStamp();        
    }


    /**
     * executes a bottle-throw and reduces the character's bottles
     */
    throwBottle () {
        this.environment.bottle.throw(this.centerX, this.centerY, 15, this.isMirrored);
        this.bottles--;
        this.setNewTimeStamp();
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
        this.lastMove = this.now;
    }


    /**
     * update the caracter's properties, depending on the given item.
     * plays the correspondending sound
     * @param {object} item 
     */
    updateProperties (item) {
        if (item.visible) {
            if (this.hasEnoughMoney(item.price) || item.type == 'beehive') {
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
                flashElement('imgCoin');
            }   
        }
    }


    /**
     * determines if the character has enough money for the given price
     * @param {number} price value to check
     * @returns true | false
     */
    hasEnoughMoney(price) {
        return this.coins - price >= 0;
    }


    /**
     * character buys one of the following items:
     * chili, medicine, food, drinks, seed, bottle, gun or bullet, 
     * function is called from shop only!
     */
    buyGood(item, price) {    
        // if (this.isDead) return; 
        if (this.hasEnoughMoney(price)) {     
            let itemSold = this.parseItem(item);      
            if (itemSold == true) {
                Sounds.play('kaching');
                this.coins -= price;
            } else {
                // just make sure that we flash the right icon if we got a gun and have more than 6 bullets!
                if (itemSold == 'imgBullet' && $('imgBullet').classList.contains('hidden')) itemSold = 'imgGun';
                flashElement(itemSold);
                Sounds.play('chord');
            }     
        } else {
            Sounds.play('money')
            flashElement('imgCoin');
        }
    }

    /**
     * update the character's collected bottles and coins
     * @param {object} item bottle or coin item
     * @param {object} bonus item found in a jar or chest
     */
    updateItems(item, bonus) {
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
            const name = bonus.replace(/[0-9]/g, '');
            this.environment.bonus.animate(item.X, item.Y, name);
            item.contains = null;
            if (item.type == 'chest') {
                this.keyForChest--;
                if (this.keyForChest < 0) this.keyForChest = 0;
            }
            this.parseItem(bonus);
            // if (gameSettings.debugMode) console.log(name + ' found...');
        }  
    }


    /**
     * parses a found item and updates the character's belongings or properties
     * @param {string} itemName the name of the found item including it's value
     */
    parseItem(itemName) {
        let value = parseInt(itemName.replace(/[^0-9]/g,'')),
            name = itemName.replace(/[0-9]/g, '');
        switch (name) {
            case 'key':
                if (this.keyForChest >= this.environment.levelNo) return 'imgKey';
                this.keyForChest++;
                break;
            case 'coin':
                this.coins += value;
                break;
            case 'bullet':
                if (this.bullets >= this.environment.levelNo * 6) return 'imgBullet';
                this.bullets++;        
                break;
            case 'gun':
                if (this.gun) return 'imgGun';
                this.gun = true;
                break;
            case 'food':
                this.jumpPower += value / 2;
                this.energy += value; 
                break;
            case 'medicine':
                this.energy += value * 10; 
                this.accuracy -= value;
                break;
            case 'drink':
                this.accuracy += (value - 2) * 1.5;
                this.energy += value / 2;                     
                break;
            case 'chili':
                this.sharpness += (value - 2) * 1.5;
                this.jumpPower += Math.round(value / 4);        
                break;
            case 'seed':
                this.seeds += value;
                this.jumpPower -= value;
                break;        
            case 'bottle':
                if (this.bottles >= 10) return 'imgSharpness';
                this.bottles++;
                this.jumpPower--;
                break;
        } 
        this.adjustProperties(this.environment.levelNo * 10);
        return true;
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