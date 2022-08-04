import Character from './character.class.js';
import Chicken from './chicken.class.js';
import Chicklet from './chicklet.class.js';
import Endboss from './endboss.class.js';
import Bees from './bees.class.js';
import Snake from './snake.class.js';
import Scorpion from './scorpion.class.js';
import Spider from './spider.class.js';

import Level from './level.class.js';
import Bonus from './bonus.class.js';
import Bottle from './bottle.class.js';
import Seed from './seed.class.js';
import IntervalListener from './intervals.class.js';

import { APP_NAME, CANVAS_HEIGHT, CANVAS_WIDTH, canvasParent, COLL_TOP, COLL_RIGHT, COLL_BOTTOM, COLL_LEFT } from '../const.js';
import { showIntroScreen, updateGameStatus, arrIntervals, pauseGame, resumeGame, Sounds, Intervals } from '../game.js';
import { saveSettings, gameSettings } from '../settings_mod.js';
import { random, sleep } from '../library.js';

export default class World { 
    Pepe;  
    level;
    levelNo = 1;
    keyboard;
    cnv;
    ctx; 
    camera_X = 0;
    eastEnd;
    westEnd;
    groundY = 150;
    gamePaused = undefined;
    levelUp = false;
    fullscreen = false;

    Intervals;
    arrBackgrounds;
    arrForegrounds;
    arrFood;
    arrObstracles; 
    arrEnemies;
    arrClouds;
    arrItems;
    bottle;
    bonus;
    seed;
    
    requestID = undefined; // ID for requestAnimationFrame
    mainID = undefined;

    constructor (canvas, keyboard) {
        this.cnv = canvas; // assigning the global canvas to a local variable
        this.ctx = canvas.getContext('2d');        
        this.keyboard = keyboard;
        this.levelNo = gameSettings.lastLevel;
        this.Pepe = new Character(this); 
        this.gamePaused = undefined;               
        this.initLevel (this.levelNo);
        this.draw();
        this.mainID = this.run();
        arrIntervals.push(this.mainID);
        // this.Intervals = new IntervalListener();
        // this.Intervals.add(this.run,250)
    }

    initLevel (levelNo) {
        this.level = new Level(levelNo);
        this.eastEnd = this.level.eastEnd;
        this.westEnd = this.level.westEnd;  
        this.arrBackgrounds = this.level.Backgrounds;
        this.arrForegrounds = this.level.Foregrounds;
        this.arrObstracles = this.level.Obstracles;
        this.arrClouds = this.level.Clouds;
        this.arrEnemies = this.level.Enemies;
        this.arrFood = this.level.Food;
        this.arrItems = this.level.Items;
        this.bonus = new Bonus('./img/Status/Bonus/spin0.png');
        this.bottle = new Bottle('./img/Items/Bottles/rotation/spin0.png');
        this.seed = new Seed('./img/Seed/seed1.png');
        if (gameSettings.debugMode) {
            console.log('World created... ', this);
            console.log('Intervals...', Intervals.list());
            // debugger
        }        
    }

    async nextLevel () {
        this.levelNo++;
        this.initLevel(this.levelNo);
        this.Pepe.X = 50;
        await showIntroScreen(this.levelNo);    
        await sleep(3500);            
    }

    run () {
        return setInterval(() => {
            this.checkEnemyCollisions();
            this.checkFoodCollisions();
            this.checkItemCollisions();
            this.checkObstracleCollisions();  
            this.checkBottelCollisions();
            this.checkSeedCollision();
            this.checkForShopping();
            this.checkActions();  
            this.checkKeyboard();
            // this.checkForPause();
            updateGameStatus (this.Pepe);
            // levelUp is set in checkBottelCollisions()
            if (this.levelUp) {
                this.levelUp = false;
                this.nextLevel();
            }         
        }, 200);
    }

    /**
     * draw method: called to draw different objects or arrays of objects
     * workflow:    - delete the canvas
     *              - draw the objects (or arrays) in correct order (farest background first!)
     *              - recursive call by method 'requestAnimationFrame'
     *              - since 'this'  does not refer to the class inside the local function,
     *                we use a work around by using 'Me' as reference to 'this'
     */
    draw () {       
        this.ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); // delete canvas
        this.ctx.translate(this.camera_X, 0); // move the camera scope by 100px to left

        // mind the z-index of all elements!
        this.plot (this.arrBackgrounds); 
        this.plot (this.Pepe);
        this.plot (this.arrEnemies);
        this.plot (this.arrForegrounds);
        this.plot (this.arrClouds); 
        this.plot (this.arrFood);
        this.plot (this.bottle);
        this.plot (this.seed);
        this.plot (this.bonus);   
        if (this.gamePaused) this.showPauseScreen();     
        
        this.ctx.translate(-this.camera_X, 0); // move the camera scope by 100px back to right after drawing the context
        let Me = this;
        this.requestID = window.requestAnimationFrame(() => {Me.draw()});
    }
    
    /**
     * draws the passed object(image) on the canvas
     * @param {class} object either a single object or an array of objects to be drawn
     */
    plot (object) {
        if (Array.isArray(object)) {
            object.forEach(obj => {
                this.plot(obj); // recursive call!
                // if (obj.isMirrored) this.flipImage(obj);
                // obj.draw(this.ctx, gameSettings.showFrame && gameSettings.debugMode);
                // if (obj.isMirrored) this.flipImage(obj, true);
            });
        } else { // just to avoid confusions: we got a single object here!
            if (object.isMirrored) this.flipImage(object);
            object.draw(this.ctx, gameSettings.showFrame && gameSettings.debugMode);
            if (object.isMirrored) this.flipImage(object, true);            
        }                
    }

    flipImage (object, restore = false) {
        if (restore) {
            object.X = object.X * -1;
            this.ctx.restore();
        } else {
            this.ctx.save();
            this.ctx.translate(object.width, 0);
            this.ctx.scale(-1, 1);
            object.X = object.X * -1;
        }
    }

    /**
     * handle all enemy-collisions ANCHOR Enemycollision
     */
    checkEnemyCollisions () {        
        this.level.Enemies.forEach((enemy) => {
            if (enemy.isAlive()) {   
                let collision = this.Pepe.isColliding(enemy); 
                if (collision == COLL_TOP) {
                    if (enemy instanceof Chicken || enemy instanceof Chicklet) {
                        Sounds.play(enemy.type);
                        enemy.remove('dead');                        
                        this.enlargeChickens(parseInt(gameSettings.chickenEnlargement)); 
                        let score = this.levelNo * 10;                      
                        // killed a friendly chicken ?!
                        if (enemy.isFriendly) {
                            score = score * -2;
                            this.level.createChicklets(this.levelNo * 2 + 1, enemy.X + random(70,300))           
                        }                         
                        this.Pepe.score += score;
                    } else if (enemy instanceof Spider || enemy instanceof Scorpion) { 
                        Sounds.play('splat');
                        this.Pepe.score += parseInt(this.levelNo * enemy.damage);
                        enemy.remove('dead');
                    }
                } else if (collision) { // any other collision, no matter from what side
                     if (!enemy.isFriendly) {
                        // if we met a snake and can shoot it...
                        if (enemy instanceof Snake && this.keyboard.SPACE && this.Pepe.canShoot()) {
                            this.Pepe.shoot();
                            if (this.Pepe.hitSuccessful()) {
                                this.Pepe.score += parseInt(this.levelNo * enemy.damage);
                                enemy.remove('dead');
                            } else {
                                Sounds.play('ricochet');
                            }
                        } else {
                            this.Pepe.hit(enemy.damage);
                            if (!this.Pepe.isDead()) Sounds.play('ouch');
                        }                    
                    }
                    // play sounds of bees and snakes... 
                    if (enemy instanceof Bees || enemy instanceof Snake) Sounds.play(enemy.type);
                }
            }
        });
    }

    /**
     * enlarges the remaining chicken by some pixels after a chicken was killed.
     * value can be determined in settings
     * chicken's damage is going to be inreased too by level number!
     * @param {number} increment determines the pixels the chicken to be enlarged
     */
    enlargeChickens (increment = 2) {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && enemy.isAlive() && !enemy.isFriendly) {
                enemy.width +=increment;
                enemy.height +=increment;
                enemy.Y -=increment; // make sure the chicken remains on ground-level!
                enemy.damage += this.levelNo;
            }
        });
    }

    /**
     * checks collision with foot, and if we got enough money...
     */
    checkFoodCollisions() {
        this.level.Food.forEach((food) => {
            if (this.Pepe.isColliding(food) && this.keyboard.SPACE) {
                this.Pepe.updateProperties(food);
            }
        });
    }

    /**
     * checks collision with items (coins, bottles, jar or chest)
     * and update the items in character
     */
    checkItemCollisions() {
        this.level.Items.forEach((item) => {
            if (this.Pepe.isColliding(item) && this.keyboard.SPACE) {
                let foundBonus;
                if (item.type == 'jar' || (item.type == 'chest' && this.Pepe.keyForChest)) {
                    foundBonus = item.contains;
                }
                this.Pepe.updateItems(item, foundBonus);  
            }
        });
    }

    checkForShopping () {
        this.level.Backgrounds.forEach((item) => {
            if (this.Pepe.isInFrontOfShop(item) && this.keyboard.SPACE) {
                this.Pepe.buyItems(); 
            }            
        });
    }

    /**
     * checks for collision with obstracles:
     * - can we jump on a stone or a chest ?!
     */
    checkObstracleCollisions() {
        this.level.Obstracles.forEach((barrier) => {
            if (this.Pepe.isColliding(barrier) && barrier.onCollisionCourse && barrier.damage > 0) {                    
                // can we jump on the obstracle?
                if (barrier.canJumpOn) {
                    if (this.Pepe.isAboveGround(barrier.Y)) {
                        // debugger
                        this.Pepe.Y -= barrier.height;
                    } else {
                        // this.Pepe.energy -=barrier.damage;
                        // this.Pepe.hit(barrier.damage);
                    } 
                }                                        
            }
        });
    }

    checkBottelCollisions () {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                if (this.bottle.isColliding(enemy)) {
                    this.bottle.hide();
                    if (this.Pepe.hitSuccessful()) {
                        enemy.hit(this.Pepe.sharpness / 10);
                        Sounds.play('chicken');
                    } else {
                        Sounds.play('glass');
                    }                   
                }
                this.levelUp = this.allEndbossesKilled (enemy);
                if (this.levelUp) return;
            }
        });
    }

    /**
     * find all endbosses in the current level, since there can be more than one...
     */
    getAllEndbosses () {
        const allBosses = this.arrEnemies.filter(boss => {
            return (boss instanceof Endboss && boss.isAlive());
        }); 
        return allBosses;
    }

    allEndbossesKilled (boss) {
        if (boss.isDead()) {
            let timeElapsed = new Date().getTime();
            if (timeElapsed - boss.diedAt > 3) {
                boss.remove('dead');
                return (this.getAllEndbosses().length == 0);
            }                    
        }  
    }

    /**
     * checks if a chicken collides with seed and set it to 'friendly' if so
     */
    checkSeedCollision () {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && enemy.isAlive()) {
                if (this.seed.isColliding(enemy)) {
                    this.seed.hide();
                    enemy.isFriendly = true;
                    enemy.damage = 0;
                }
            }
        });
    }

    /**
     * checks for several actions with SPACE-key:
     * - throwing a bottle
     * - shooting (if no bottles available but a loaded gun)
     */
    checkActions() {
        if (this.keyboard.SPACE) {
            const boss = this.Pepe.isCloseEnemy('endboss');
            if (boss) {
                if (this.Pepe.bottles > 0) {                
                    this.Pepe.throwBottle();
                } else if (this.Pepe.canShoot()) {
                    this.Pepe.shoot();
                    if (this.Pepe.hitSuccessful()) {
                        boss.energy = 0;
                        this.levelUp = this.allEndbossesKilled(boss);
                    } else {
                        Sounds.play('ricochet');
                    }
                }
            }            
        }
    }

    /**
     * checking several keyboard activities:
     * - throwing seed (if possible)
     * - pause game
     * - quit game
     * - save game
     * - enabling fullscreen mode
     */
    checkKeyboard() {        
        if (this.keyboard.CTRL_LEFT && this.Pepe.seeds > 0) {
        // throw seed...
            this.seed.throw(this.Pepe.X + this.Pepe.width / 2, 
            this.Pepe.Y + this.Pepe.height * 0.666, 3, this.Pepe.isMirrored);
            this.Pepe.seeds--;
            this.Pepe.setNewTimeStamp();
        } else if (this.keyboard.P_KEY) {
        // pause game...
            // on game start we set the flag explicit...
            if (this.gamePaused === undefined) {
                this.gamePaused = true;
                Intervals.stop();
            } else if (this.gamePaused == true) { // ... then we toggle it!
                this.gamePaused = undefined;
                Intervals.start();
            }           
        } else if (this.keyboard.S_KEY) {
        // save game...
            saveSettings(APP_NAME,this.Pepe)
        } else if (this.keyboard.Q_KEY) {
        // quit game (commit suicide)...
            Sounds.play('suicide');
            this.Pepe.energy = 0;
        } else if (this.keyboard.F8_KEY) {
        // fullscreen mode...
            this.fullscreen = !this.fullscreen;
            // if (this.fullscreen) {
                canvasParent.requestFullscreen();
            // } else {
            //     document.exitFullscreen();
            // }
        }         
    }

    // checkForPause () {
    //     if (this.gamePaused === true) {
    //         Intervals.stop();
    //         pauseGame();
    //     } else if (this.gamePaused === false) { // important: NOT 'undefined' !!!
    //         debugger
    //         resumeGame();
    //     }   
    // }

    showPauseScreen() {
        this.ctx.fillStyle = 'navy';
        this.ctx.font = '60px san-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game paused...', this.cnv.width  / 2, 210);
    }
}