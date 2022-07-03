import Character from './character.class.js';
import Chicken from './chicken.class.js';
import Endboss from './endboss_old.class.js';
import Bees from './bees.class.js';
import Snake from './snake.class.js';
import Level from './level.class.js';
import Bonus from './bonus.class.js';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';
import { gameSettings, updateGameStatus, arrIntervals, objAudio } from '../game.js';
import { playSound } from '../library.js';
import Bottle from './bottle.class.js';

export default class World {   
    // DECLARATIONS
    debugMode = false;
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

    arrBackgrounds;
    arrForegrounds;
    arrFood;
    arrObstracles; 
    arrEnemies;
    arrClouds;
    arrItems;
    bottle;
    bonus;
    
    requestID = undefined; // ID for requestAnimationFrame
    runID = undefined;

    constructor (canvas, keyboard) {
        this.cnv = canvas; // assigning the global canvas to a local variable
        this.ctx = canvas.getContext('2d');        
        this.keyboard = keyboard;
        this.debugMode = gameSettings.debugMode;
        this.levelNo = gameSettings.lastLevel;
        this.Pepe = new Character(this);        
        this.initLevel (this.levelNo);
        this.draw();
        this.run();
        arrIntervals.push(this.runID);         
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
        this.bottle = new Bottle('./img/Items/Bottles/rotation/spin0.png');;
        if (gameSettings.debugMode) {
            console.log('World created... ', this);
        }
    }

    run () {
        this.runID = setInterval(() => {
            this.checkCollisions();
            this.checkActions();           
        }, 250);
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
        this.plot (this.bonus);
        
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
                obj.draw(this.ctx, this.debugMode);
            });
        } else { // just to avoid confusions: we got a single object here!
            if (object.isMirrored) this.flipImage(object);
            object.draw(this.ctx, this.debugMode);
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

    checkCollisions () {
        //  collision with enemy...
        this.level.Enemies.forEach((enemy) => {
            if (this.Pepe.isColliding(enemy)) {
                if (this.Pepe.isAboveGround()) {
                    if (enemy.isAlive()) {
                        if (enemy instanceof Chicken) {
                            playSound(objAudio['chicken'], gameSettings.soundEnabled);
                            enemy.remove('dead');
                        } else if (enemy instanceof Bees) {
                            playSound(objAudio['bees'], gameSettings.soundEnabled);
                        } else if (enemy instanceof Snake) {
                            playSound(objAudio['snake'], gameSettings.soundEnabled);
                        } else if (enemy instanceof Endboss) {

                        } else {
                            playSound(objAudio['splat'], gameSettings.soundEnabled);
                            console.log(enemy.name )
                            // debugger

                            enemy.remove('dead');
                            // enemy.remove('splash3');
                        }                        
                        this.Pepe.score += this.levelNo * 10;                  
                    }                        
                } else if (enemy.isAlive()) {
                    if (enemy instanceof Bees) {
                        playSound(objAudio['bees'], gameSettings.soundEnabled);
                    } else if (!this.Pepe.isDead()) {
                        playSound(objAudio['ouch'], gameSettings.soundEnabled);
                    }
                    this.Pepe.hit(enemy.damage);
                    if (!enemy instanceof Chicken && !enemy instanceof Endboss) enemy.damage = 0;
                }   
             }
        });

        this.checkFoodCollisions();
        this.checkItemCollisions();
        this.checkObstracleCollisions();
        updateGameStatus (this.Pepe);
    }

    /**
     * collision with foot...
     */
    checkFoodCollisions() {
        this.level.Food.forEach((food) => {
            if (this.Pepe.isColliding(food) && this.keyboard.SPACE) {
                this.Pepe.updateProperties(food);
            }
        });
    }

    /**
     *  collision with items...
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

    /**
     *  collision with obstracles
     */
    checkObstracleCollisions() {
        this.level.Obstracles.forEach((barrier) => {
            if (this.Pepe.isColliding(barrier) && barrier.onCollisionCourse && barrier.damage > 0) {                    
                // can we jump on the obstracle?
                if (barrier.canJumpOn) {
                    if (this.Pepe.isAboveGround(barrier.Y)) {
                        debugger
                        this.Pepe.Y -= barrier.height;
                    } else {
                        // this.Pepe.energy -=barrier.damage;
                        // this.Pepe.hit(barrier.damage);
                    } 
                }                                        
            }
        });
    }

    checkActions() {
        if (this.keyboard.CTRL_LEFT && this.Pepe.isClose('endboss')) {
            if (this.Pepe.bottles > 0) {                
                this.bottle.throw(this.Pepe.X + this.Pepe.width/2, 
                this.Pepe.Y + this.Pepe.height/2,15, this.Pepe.isMirrored);
                this.Pepe.bottles--;
                this.Pepe.setMoveTimeStamp();
            } else if (this.Pepe.gun && this.Pepe.bullets > 0) {
                console.log('SCHUSS!...' )
                this.Pepe.bullets--;
                this.Pepe.setMoveTimeStamp();
                debugger
            }
        }
    }
}