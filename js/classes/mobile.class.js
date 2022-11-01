import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH, COLLISION } from '../const.js';
import { gameSettings } from '../settings_mod.js';
import { Intervals } from '../game.js';
import Graphics from './graphics.class.js';

export default class Mobile extends Graphics {    
    get top() {return this.Y + this.offsetY;}
    get left() { return this.X;}
    get bottom() {return this.Y + this.height;}
    get right() {return this.X + this.width;}
    get centerX() {return this.X + this.width / 2;}
    get centerY() {return this.Y + (this.height + this.offsetY) / 2;}

    get isHurt() {return this.timeElapsed(this.lastHit) < this.hurtDelay;} 
    get isSleeping() {
        return (this.timeElapsed(this.lastMove) > parseInt(gameSettings.sleepTime));
    } 
    get isDead() {
        if (this.isAlive) return false;        
        if (this.diedAt == null) this.diedAt = this.now;
        return true;
    }
    get isAlive() {return this.energy > 0;}
    get isAboveGround () {return this.Y < this.groundY;}      

    get now() {return new Date().getTime();}
    get fivty50() {return Math.random() >= 0.5;} // returns a 50:50 chance

    speed = 0.15;           // default speed
    speedY = 0;             // gravity acceleration
    acceleration = 0.5;
    home = {X: 0, Y: 0};  
   
    lastHit = 0;            // time elapsed since Object was hit
    lastMove = this.now;    // time elapsed since Object has moved
    diedAt = null;
    hurtDelay = 1;

    arrAnimation = []; 
    animationID = undefined;
    moveID = undefined;
    gravarityID = undefined;

    constructor(level) {
        super(level);
    }
    
    /**
     * moves an object into the given direction
     */
    move($this, milliseconds = 1000, loop = true) {
        Intervals.add (
            function move() {
                let speed = ($this.moveDirection == 'left') ? Math.abs($this.speed) * -1 : Math.abs($this.speed);
                $this.X += speed;
                if (loop == true) {
                    if (speed < 0 && $this.right < $this.westEnd) $this.X = $this.eastEnd;
                    if (speed > 0 && $this.X > $this.eastEnd) $this.X = $this.westEnd;
                }
            }, milliseconds / FPS, $this, loop
        );
    }


    /**
     * plays an animation from the given array of pictures      
     * @param {string} arrImages string array containing the path for the images
     * @param {string} subkey creates together with name and index the key of the image in 'imageCache' 
     */
    playAnimation(arrImages, subkey = 'wlk') {  
        const arr = arrImages.filter(img => {return img.includes(subkey)});  
        
        // if (subkey == 'dollar') {
        //     console.log(arrImages)
        //     debugger
        // }
        
        this.imgIndex++;     
        if (this.imgIndex >= arr.length) this.imgIndex = 0;
        let key = this.name + '_' + subkey + this.imgIndex;   // i.e key = Pepe_wlk0     
        this.image = this.imageCache[key];
        
        // for debugging only !!
        if (this.image === undefined) {
            console.warn(`Image "${key}" von ${this.name} undefined!`, this);
            console.log('Filtered arr: ', arr);
            debugger;
        }
    }


    /**
     * Applies the gravity for the current object, if it is in the air.
     * Therefor we increase the Y-coordinate by the acceleration speed
     */
    applyGravity($this) {
        // returns the interval-ID! (for seed and bonus class)
        return Intervals.add(
            function gravity () {
                if ($this.isAboveGround || $this.speedY < 0 ) {
                    $this.Y += $this.speedY;
                    $this.speedY += $this.acceleration; 
                 } else {
                    $this.Y = $this.groundY;
                    $this.speedY = 0;
                } 
            }, 1000 / FPS, $this
        )
    }


    /**
     * executes a hit to an object, taking time since last hurt under consideration
     * if still alive, we save a new time stamp since last hit
     * @param {number} damage damage to be subtract from character's energy
     */
    hit(damage) {
        if (this.lastHit == 0 || (this.now - this.lastHit) / 1000 > this.hurtDelay) {
            this.energy -=damage;
            if (this.energy < 0) {
                this.energy = 0;
                return;
            }
            this.lastHit = this.now;
        }
    }


    /**
     * helper function
     * @param {number} since time in milliseconds to be calculated
     * @returns time elapsed in seconds
     */
    timeElapsed(since) {
        return (this.now - since) / 1000;
    }


    /**
     * get all endbosses in the current level
     * and check, if one of them is close enough for a hit
     * distance left from the enymy is a third,
     * distance right from the enymy is a quarter of the canvas width,
     * @param {string} enemyType optional, for further using...
     * @returns true | false
     */
    isCloseEnemy(enemyType = 'endboss') {
        // TODO function to determine all enemies of the wanted type
        // i.e. let enemies = getEnemies(enemyType)
        const bosses = this.environment.level.EndBosses;
        // let enemies;
        // if (enemyType = 'endboss') enemies = bosses; // special case!
        let retVal = false;
        bosses.forEach(boss => {            
            let distance = this.isLeftFrom(boss) ? boss.left - this.right : this.left - boss.right;
            if (this.isLeftFrom(boss) && !this.isMirrored && Math.abs(distance) <= CANVAS_WIDTH / 1.5 || 
                this.isRightFrom(boss) && this.isMirrored && Math.abs(distance) <= CANVAS_WIDTH / 4) {
                retVal = boss;
                return;
            }
        });
        return retVal;
    }


    /**
     * determines if the character is left or right side of the object 
     * @param {object} obj to be tested
     * @returns true | false
     */
    isLeftFrom(obj) {
        // return this.right < obj.left;
        return this.centerX < obj.left;
    }


    isRightFrom(obj) {
        // return this.left > obj.right;
        return this.centerX > obj.right;
    }


    /**
     * detects if the given object collides with the caracter.
     * @param {class} object to check collision with
     * @returns false | null for no collision; 12 | 3 | 6 | 9 for clockwise side
     */
    isColliding(obj) {
        if (!obj.onCollisionCourse || 
            this.right < obj.left || this.left > obj.right ||
            this.top > obj.bottom || this.bottom < obj.top) {
            return false;
        }
        return this.getCollisionSide(obj);             
    }


    /**
     * helper function for  => isColliding.
     * determines, from which side a collision takes place
     * @param {object} obj 
     * @returns COLLISION.top(12), .right(3), .bottom(6), .left(9)
     */
    getCollisionSide(obj) {
        const depth = this.getCollisionDepth(obj);
        // having the depth, pick the smaller depth and move along that axis
        if (depth.X != 0 && depth.Y != 0) {
            // Collision along the X-axis...
            if (Math.abs(depth.X) < Math.abs(depth.Y)) {                
                if (depth.X > 0) return COLLISION.left;
                return COLLISION.right;
            // Collision along the Y-axis...    
            } else { 
                if (depth.Y > 0) return COLLISION.top;
                return COLLISION.bottom;
            }
        }
        return null;
    }


    /**
     * Step 1: Calculate the distance between centers
     * Step 2: Calculate the minimum distance to separate along X and Y
     * Step 3: Calculate the depth of collision for both the X and Y axis
     * @param {object} obj the colliding object
     * @returns JSON with X- and Y-depth
     */
    getCollisionDepth(obj) {
        // Step 1 
        let diffX = this.centerX - obj.centerX,
            diffY = this.centerY - obj.centerY;
        // Step 2 
        let minDistX = this.width / 2 + obj.width / 2,
            minDistY = this.height / 2 + obj.height / 2;    
        // Step 3 
        let depthX = diffX > 0 ? minDistX - diffX : -minDistX - diffX,
            depthY = diffY > 0 ? minDistY - diffY : -minDistY - diffY;
        
        return {X: depthX, Y: depthY};
    }


    /**
     * hides an object (i.e. after it was collected or killed)
     * by stopping it's intervals an moving it out of the screen 
     * @param {string} intervalKey key to access all interval-id's
     */
    hide(intervalKey) {
        Intervals.remove(intervalKey);
        this.gravarityID = undefined;
        this.animationID = undefined;
        this.moveID = undefined;
        this.Y = CANVAS_HEIGHT * 2;
    }
}