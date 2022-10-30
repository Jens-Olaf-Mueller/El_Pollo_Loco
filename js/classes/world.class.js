import Game from './game.class.js';
import Character from './character.class.js';
import Keyboard from './keyboard.class.js';
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

import { APP_NAME, CANVAS_HEIGHT, CANVAS_WIDTH, canvasParent, GROUND, COLLISION } from '../const.js';
import { showIntroScreen, updateStatusbar, Sounds, Intervals, demoMode } from '../game.js';
import { saveSettings, gameSettings } from '../settings_mod.js';
import { sleep } from '../library.js';

export default class World extends Game { 
    Pepe;  
    level;
    levelNo = 1;
    keyboard = new Keyboard();
    cnv;
    ctx; 
    camera_X = 0;
    eastEnd;
    westEnd;
    groundY = GROUND;
    gamePaused = false;

    arrBackgrounds;
    arrForegrounds;
    arrFood;
    arrObstracles; 
    arrEnemies;
    arrEndBosses;
    arrClouds;
    arrItems;
    arrEndbossFood = [];

    bottle;
    bonus;
    seed;
    
    reqAnimationFrameID = undefined; 
    mainID = undefined;
    lastSaved = 0;

    get gameSaved() {((this.now - this.lastSaved) / 1000) < 4};
    get now() {return new Date().getTime();}

    constructor(canvas) {
        super();
        this.cnv = canvas; // assigning the global canvas to a local reference variable
        this.ctx = canvas.getContext('2d');
        // this.levelNo = gameSettings.lastLevel;
        this.levelNo = this.settings.lastLevel;
        Intervals.clear(); // must be executed BEFORE new Character!!!
        this.Pepe = new Character(this);                     
        this.initLevel(this.levelNo);  
        this.draw();        
    }

    initLevel(levelNo) {
        this.level = new Level(levelNo, this);
        this.arrEndbossFood = [];
        this.eastEnd = this.level.eastEnd;
        this.westEnd = this.level.westEnd;  
        this.arrBackgrounds = this.level.Backgrounds;
        this.arrForegrounds = this.level.Foregrounds;
        this.arrObstracles = this.level.Obstracles;
        this.arrClouds = this.level.Clouds;
        this.arrEnemies = this.level.Enemies;
        this.arrEndBosses = this.level.EndBosses;
        this.arrFood = this.level.Food;
        this.arrItems = this.level.Items;
        this.bonus = new Bonus('./img/Status/Bonus/spin0.png');
        this.bottle = new Bottle('./img/Items/Bottles/rotation/spin0.png');
        this.seed = new Seed('./img/Seed/seed1.png');
        if (gameSettings.debugMode) {            
            console.log('World created... ', this);
            if (gameSettings.logIntervals) Intervals.list();
        }   
        this.mainID = this.run();     
    }


    /**
     * this is the main interval to check all actions and events
     * @returns id of the main interval
     */
    run() {
        return setInterval(() => {
            this.checkEnemyCollisions();
            this.checkObstracleCollisions();  
            this.checkBottelCollisions();
            this.checkSeedCollision();
            this.checkKeyboard();
            updateStatusbar(this.Pepe);
            if (this.level.solved) this.nextLevel();         
        }, 125); // 200 ??
    }


    /**
     * initializes the next level
     */
    async nextLevel() {
        this.mainID = clearInterval(this.mainID);
        setTimeout(async () => {
            this.levelNo++;
            await sleep(2500);
            await showIntroScreen(this.levelNo);
            this.initLevel(this.levelNo);
            this.Pepe.X = 50;
            this.Pepe.bottles = 0;
            if (this.Pepe.accuracy > 100) this.Pepe.accuracy -= this.levelNo * 10;
            if (this.Pepe.sharpness > 100) this.Pepe.sharpness -= this.levelNo * 10;  
        }, 3000);                            
    }


    /**
     * draw method: called to draw different objects or arrays of objects
     * workflow:    - delete the canvas
     *              - draw the objects (or arrays) in correct order (farest background first!)
     *              - recursive call by method 'requestAnimationFrame'
     *              - since 'this'  does not refer to the class inside the local function,
     *                we use a work around by using '$this' as reference to 'this'
     */
    draw() {       
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
        if (this.gamePaused) {
            this.printText(this.Pepe.X + this.Pepe.width - 60, 180, 'Game paused ...',72, 'goldenrod');
        } 
        if (this.gameSaved) {
            let msg = gameSettings.debugMode ? `No saving in debug mode!` : 'Game saved';
            this.printText (this.Pepe.X + this.Pepe.width - 60, 100, msg , 48, 'navy');
        }
        
        this.ctx.translate(-this.camera_X, 0); // move the camera scope by 100px back to right after drawing the context
        let $this = this;
        this.reqAnimationFrameID = window.requestAnimationFrame(() => {$this.draw()});
    }
    

    /**
     * draws the passed object(image) on the canvas
     * if an array is passed as parameter the method calls itself recursively
     * @param {class} object either a single object or an array of objects to be drawn
     */
    plot(object) {
        if (Array.isArray(object)) {
            object.forEach(obj => {
                this.plot(obj); // recursive call!
            });
        } else { // just to avoid confusions: we got a single object here!
            if (object.isMirrored) this.flipImage(object);
            object.draw(this.ctx, gameSettings.showFrame && gameSettings.debugMode);
            if (object.isMirrored) this.flipImage(object, true);            
        }                
    }


    /**
     * flips an image or restores it
     * @param {class} object to be flipped
     * @param {boolean} restore true means we restore the original direction
     */
    flipImage(object, restore = false) {
        object.X = object.X * -1;
        if (restore) {
            this.ctx.restore();
            return;
        }
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
    }


    /**
     * handle all enemy-collisions and possible reactions. (killing etc.)
     * checks for:
     * - chicklets & chicken
     * - killed friendly chicken (if so creates new chicklets!)
     * - spiders & scorpions
     * - snakes (and if they can be shot)
     * - bees (sound output only)
     */
    checkEnemyCollisions() {        
        this.level.Enemies.forEach((enemy) => {
            if (enemy.isAlive) {   
                let collision = this.Pepe.isColliding(enemy); 
                // handle bottom-side collisions seperately!
                if (collision == COLLISION.bottom) {
                    this.handleBottomCollision(enemy);
                } else if (collision){
                    this.handleCollision(enemy);
                } 
            }
        });
    }


    /**
     * handles a collision with an enemy
     * @param {object} enemy any enemy-object (chicken, snake, endboss etc.)
     */
    handleCollision(enemy) {
        if (this.level.shop.inside) return; // no collision if we are in shop!!!
        if (!enemy.isFriendly) {
            // if we met a snake and can shoot - execute a shot!
            if (enemy instanceof Snake && this.keyboard.SPACE && this.Pepe.canShoot) {
                this.Pepe.shoot();
                if (this.Pepe.hitSuccessful) {
                    this.Pepe.score += parseInt(this.levelNo * enemy.damage);
                    enemy.remove();
                } else {
                    Sounds.play('ricochet');
                }
            } else { // Pepe was simply hit by an enemy...
                this.Pepe.hit(enemy.damage);
                if (this.Pepe.isAlive) Sounds.play('ouch');
            }                    
        }
        // play sounds of bees and snakes... 
        if (enemy instanceof Bees || enemy instanceof Snake) Sounds.play(enemy.type);
    }


    /**
     * handles the special case of bottom collision, 
     * since some enemies can be killed by jumping on them
     * @param {object} enemy enemies: chicken, chicklet, spider, scorpion
     */
    handleBottomCollision(enemy) {
        if (enemy instanceof Bees || enemy instanceof Snake) return;
        let score = parseInt(this.levelNo * enemy.damage) || 0; 
        if (enemy instanceof Chicken || enemy instanceof Chicklet) {
            score = this.levelNo * 10;
            Sounds.play(enemy.type);                      
            this.enlargeChickens(parseInt(gameSettings.chickenEnlargement));                                  
            // killed a friendly chicken ?!
            if (enemy instanceof Chicken && enemy.isFriendly) {
                score = score * -2;      
                this.level.createChicklets(this.levelNo * 2 + 1, enemy.X, -35, enemy.name);           
            }                     
        } else if (enemy instanceof Spider || enemy instanceof Scorpion) { 
            Sounds.play('splat');
        }
        enemy.remove();
        this.Pepe.score += score;
    }


    /**
     * enlarges the remaining chicken by some pixels after a chicken was killed.
     * value can be determined in settings
     * chicken's damage is going to be inreased too by level number!
     * @param {number} increment determines the pixels the chicken to be enlarged
     */
    enlargeChickens (increment) {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Chicken) enemy.enlarge(increment, this.levelNo);
        });
    }


    /**
     * checks for collision with obstracles:
     * TODO - can we jump on a stone or a chest ?!
     */
    checkObstracleCollisions() {
        this.level.Obstracles.forEach((barrier) => {
            if (this.Pepe.isColliding(barrier) && barrier.onCollisionCourse && barrier.damage > 0) {                    
                // can we jump on the obstracle?
                if (barrier.canJumpOn) {
                    if (this.Pepe.isAboveGround) {
                        this.Pepe.Y -= barrier.height;
                        //TODO - Gravarity - Y ???
                        console.log('Sprung auf ' + barrier.name)
                    } else {
                        // this.Pepe.energy -=barrier.damage;
                        // this.Pepe.hit(barrier.damage);
                    } 
                }                                        
            }
        });
    }


    /**
     * checks for collision between endboss and bottle.
     * a possible hit also depends on the character's
     * accuracy and sharpness-values!
     * if all enbosses are killed, we level up!
     */
    checkBottelCollisions() {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                if (this.bottle.isColliding(enemy)) {                    
                    if (this.Pepe.hitSuccessful) {
                        this.bottle.isCollidingEndboss = true;
                        Sounds.play('endboss');
                        enemy.hit(this.Pepe.sharpness / 10);
                        this.Pepe.score += parseInt(this.Pepe.sharpness / 10 + gameSettings.endbossAttackingTime);
                    } else {
                        Sounds.play('glass');
                    }    
                    this.saveEndbossPosition(enemy);
                }
            }
        });
    }


    /**
     * save the position for display in next level as food!
     * @param {object} boss the endboss to be checked if it is killed
     */
     saveEndbossPosition(boss) {
        if (boss.isDead) {
            if (!this.arrEndbossFood.some(item => item.name === boss.name)) {
                this.arrEndbossFood.push({name: boss.name, X: parseInt(boss.X)});
            }                  
        }  
    }


    /**
     * checks if a chicken collides with seed and set it to 'friendly' if so
     */
    checkSeedCollision() {
        this.level.Enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && enemy.isAlive) {
                if (this.seed.isColliding(enemy)) {
                    this.seed.hide();
                    enemy.isFriendly = true;
                    enemy.damage = 0;
                }
            }
        });
    }


    /**
     * checking several keyboard activities:
     * - throw bottle | shoot
     * - throwing seed (if possible)
     * - pause game
     * - quit game
     * - save game
     * - enabling fullscreen mode
     */
    checkKeyboard() { 
        if (this.keyboard.SPACE && this.Pepe.isAlive) {
            this.checkFoodCollisions();
            this.checkItemCollisions();
            this.executeAction();
        }
        if (this.keyboard.CTRL_LEFT) this.throwSeed();
        if (this.keyboard.B_KEY && this.Pepe.isInFrontOfShop) this.goShopping();
        if (this.keyboard.P_KEY) this.pauseGame();           
        if (this.keyboard.S_KEY) this.saveGame(); 
        if (this.keyboard.F8_KEY) this.applyFullScreen();
        if (this.keyboard.ESCAPE) this.handleEscapeKey();                   
    }


    /**
     * since the ESCAPE-key has different tasks depending on it's context,
     * we handle it seperately here...
     */
    handleEscapeKey() {
        if (this.level.insideShop) {
            this.level.shop.exit();
            return;
        } 
        if (demoMode) {
            demoMode = false;
            return;
        }
        if (!this.gamePaused) {
            Sounds.play('suicide');
            this.Pepe.energy = 0;
        }
    }

    /**
     * checks collision with foot, and if we got enough money we take it
     */
    checkFoodCollisions() {
        this.level.Food.forEach((food) => {
            if (this.Pepe.isColliding(food)) this.Pepe.updateProperties(food);
        });
    }

    /**
     * checks collision with items (coins, bottles, jar or chest)
     * and update the items in character
     */
    checkItemCollisions() {
        this.level.Items.forEach((item) => {
            if (this.Pepe.isColliding(item)) {
                let foundBonus;
                if (item.type == 'jar' || (item.type == 'chest' && this.Pepe.keyForChest)) {
                    foundBonus = item.contains;
                }
                this.Pepe.updateItems(item, foundBonus);  
            }
        });
    }

    
    /**
     * checks for several actions with space-key:
     * - throwing a bottle
     * - shooting (if no bottles available but a loaded gun)
     */
     executeAction() {
        const boss = this.Pepe.isCloseEnemy('endboss');
        if (boss) {
            if (this.Pepe.bottles > 0) {                
                this.Pepe.throwBottle();
            } else if (this.Pepe.canShoot) {
                this.Pepe.shoot();
                if (this.Pepe.hitSuccessful) {
                    boss.energy = 0;
                    this.saveEndbossPosition(boss);
                } else {
                    Sounds.play('ricochet');
                }
            }
        }            
    }


    /**
     * throws seed if we got it in stock
     */
    throwSeed() {
        if (this.gamePaused || this.Pepe.seeds <= 0) return;
        this.seed.throw(this.Pepe.X + this.Pepe.width / 2, 
        this.Pepe.Y + this.Pepe.height * 0.666, 3, this.Pepe.isMirrored);
        this.Pepe.seeds--;
        this.Pepe.setNewTimeStamp();
    }


    /**
     * open the shop if we are in front of it and not already inside
     */
    goShopping() {
        if (this.Pepe.isInFrontOfShop && !this.level.insideShop) {
            this.keyboard.B_KEY = false; // important!
            this.pauseGame(true);
            this.level.shop.enter();
        }
    }


    /**
     * enables or disables the pause mode
     * @param {boolean} state true | false | null
     */
    pauseGame(state) {
        if (state == undefined) {
            this.gamePaused = !this.gamePaused; // causes 'true' on first call!
        } else if (state == false) {
            this.gamePaused = false;
        } else {
            this.gamePaused = true;
        }
        if (this.gamePaused) {
            Intervals.stop();
            Sounds.stop();
            Sounds.stop(gameSettings.lastSong);
            return;
        } 
        Intervals.start();
        if (gameSettings.musicEnabled) Sounds.playList(gameSettings.lastSong);
    }


    /**
     * saves the current game if we are NOT in debug-mode
     * (saving in debug is not allowed because of cheating)
     * and the game is not already saved last 4 seconds
     */
    saveGame() {
        if (!gameSettings.debugMode && !this.gameSaved) {
            saveSettings(APP_NAME,this.Pepe);
            this.lastSaved = this.now;
        }
    }


    /**
     * applies full screen mode if game is NOT paused!
     */
    applyFullScreen() {
        if (this.gamePaused == false && 
            document.fullscreenElement == null && 
            document.fullscreenEnabled) canvasParent.requestFullscreen();
    }


    /**
     * prints a text with given parameters on canvas
     */
    printText (pX, pY, text, fontsize = 72, color = '#c49961', fade = false) {
        let arrRGB = this.hexToRGB(color), alpha = 1.0;   // full opacity
        if (Array.isArray(arrRGB) && fade) {
            this.ctx.fillStyle = `'rgba(${arrRGB[0]}, ${arrRGB[1]}, ${arrRGB[2]}, ${alpha})'`;
        } else {
            this.ctx.fillStyle = color;
            fade = false;
        } 
        
        if (fade == true) {
            let ctx = this.ctx, canvasInt = this.cnv,
            fadeID = setInterval(function () {
                canvasInt.width = canvasInt.width; // Clears the canvas

                ctx.fillStyle = `'rgba(${arrRGB[0]}, ${arrRGB[1]}, ${arrRGB[2]}, ${alpha})'`;
                ctx.font = fontsize + 'px Zabars';
                ctx.fillText(text, pX, pY);
                alpha = alpha - 0.05; // decrease opacity (fade out)
                if (alpha < 0) {
                    canvasInt.width = canvasInt.width;
                    clearInterval(fadeID);
                }
            }, 50, ctx, canvasInt);
        } else {
            this.ctx.font = fontsize + 'px Zabars';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, pX, pY);
        }
    }

    /**
     * converts a hex-color to an RGB-array
     * @param {string} hex hexadecimal value of a color
     * @returns an array for colors [red, green, blue]
     */
     hexToRGB (hex) {
        if (!hex.startsWith('#')) return hex;
        return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
    }

    // /**
    //      * Test @function checkCameraTest same as @function checkCamera
    //      * on right movement or left movement, target is position some offset from middle screen,
    //      * opposed to movement direction.
    //      */
    // checkCameraTest(target) {
    //     let targetCenterX = target.x + target.width * 0.5;
    //     let canvasCenterX = this.ctx.canvas.width * 0.5;
    //     let distanceFromCamera = targetCenterX - this.cameraOffsetX;

    //     if (this.canMoveCamera(canvasCenterX, this.level.level_end_x - canvasCenterX, distanceFromCamera)) {
    //         this.camera_x = -(distanceFromCamera - canvasCenterX);
    //         if (target.isMovingRight() && targetCenterX + this.camera_x >= canvasCenterX * 0.5) {
    //             this.cameraOffsetX -= 3;
    //         }
    //         if (target.isMovingLeft() && targetCenterX + this.camera_x <= this.ctx.canvas.width - canvasCenterX * 0.5) {
    //             this.cameraOffsetX += 3;
    //         }
    //     }
    // }

    // /**
    //  * Check if camera target is inside Boundaries to allow camera movement
    //  * @param {number} leftBoundary - minium distance for target to achieve for camera to move.
    //  * @param {number} rightBoundary - maximum distance for target to achieve for camera to move.
    //  * @param {number} distanceFromCamera - how far is the camera's offset from target
    //  * @returns {boolean}
    //  */
    // canMoveCamera(leftBoundary, rightBoundary, distanceFromCamera) {
    //     return distanceFromCamera > leftBoundary &&
    //         distanceFromCamera < rightBoundary;
    // }

}