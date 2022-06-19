import Character from "./character.class.js";
import Chicken from "./chicken.class.js";
import Level from './level.class.js';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { gameSettings, updateGameStatus } from "../game.js";

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

    constructor (canvas, keyboard) {
        this.cnv = canvas; // assigning the global canvas to a local variable
        this.ctx = canvas.getContext('2d');        
        this.keyboard = keyboard;
        this.debugMode = gameSettings.debugMode;
        this.levelNo = gameSettings.lastLevel;
        this.Pepe = new Character(this);        
        this.initLevel (this.levelNo);
        this.draw();
        this.checkCollisions();           
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
        this.arrItems= this.level.Items;
        console.log('World created... ', this )
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
        // this.plot (this.arrItems);
        
        this.ctx.translate(-this.camera_X, 0); // move the camera scope by 100px back to right after drawing the context
        let Me = this;
        window.requestAnimationFrame(() => {Me.draw()});
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
        setInterval(() => {
            this.level.Enemies.forEach((enemy) => {
                if (this.Pepe.isColliding(enemy)) {  
                    // kill the enemy when we come from above
                    // console.log('Above ' + enemy.name + this.Pepe.isAboveEnemy(enemy) )
                    if (this.Pepe.isAboveGround(enemy.height - 10)) {
                        if (enemy.isAlive()) {
                            this.Pepe.score += this.levelNo * 10;
                            enemy.remove();                            
                        }                        
                    } else if (enemy.isAlive()) {
                        this.Pepe.hit(enemy.damage);
                    }   
                }
            });

            // collision with foot...
            this.level.Food.forEach((food) => {
                if (this.Pepe.isColliding(food) && this.keyboard.SPACE) {
                    this.Pepe.updateProperties(food);
                }
            });
            
            // collision with items...
            this.level.Items.forEach((item) => {
                if (this.Pepe.isColliding(item) && this.keyboard.SPACE) {
                    this.Pepe.updateItems(item);    
                }
            });

            // collision with obstracles
            this.level.Obstracles.forEach((barrier) => {
                if (this.Pepe.isColliding(barrier) && barrier.onCollisionCourse && barrier.damage > 0) {

                    // console.log(barrier.name + ' kollidiert: ' + barrier.onCollisionCourse + barrier.damage );                    
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

            updateGameStatus (this.Pepe);

        }, 250);
    }
}