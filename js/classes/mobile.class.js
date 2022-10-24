import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH, COLL_TOP, COLL_RIGHT, COLL_BOTTOM, COLL_LEFT } from '../const.js';
import { getFilename } from '../library.js';
import { gameSettings } from '../settings_mod.js';
import { Intervals } from '../game.js';

export default class Mobile {
    X = undefined;
    Y = undefined;
    offsetY = 0;
    width = undefined;
    height = undefined;
    get bottom() {return this.Y + this.height;}
    get top() {return this.Y + this.offsetY;}
    get left() { return this.X;}
    get right() {return this.X + this.width;}
    get centerX() {return this.X + this.width / 2;}
    get centerY() {return this.Y + this.height / 2;}

    get isHurt() {return this.timeElapsed(this.lastHit) < 1;} // < 0.75
    get isSleeping() {
        return (this.timeElapsed(this.lastMove) > parseInt(gameSettings.sleepTime));
    }
    get isDead() {
        if (this.isAlive) return false;        
        if (this.diedAt == null) this.diedAt = new Date().getTime();
        return true;
    }

    get isAlive() {return this.energy > 0;}

    /**
     * helper for fnc 'applyGravity': determines if object is in the air
     * @returns true | false
     */
    get isAboveGround () {
        // 1. Alle Elemente holen, die bei deiner X-Koordinate liegen
        // 2. Höhe von erstem Objekt nehmen, sonst height = 0
        // if (this.Y != this.groundY) debugger
        return this.Y < this.groundY;
    }

    speed = 0.15;           // default speed
    speedY = 0;             // gravity acceleration
    acceleration = 0.5;

    image = undefined;    
    imageBG = undefined;
    imgIndex = 0;
    imageCache = {};        // as image cache we use a jsonArray: {pictureKey: picturePath}
    isMirrored = false;     // = 'otherDirection'    
   
    lastHit = 0;            // time elapsed since Object was hit
    lastMove = new Date().getTime(); // time elapsed since Object has moved
    diedAt = null;

    loadImage(path) {
        if (this.image === undefined) this.image = new Image();
        this.image.src = (path === undefined) ? '' : path;
    }

    loadBackgroundImage(path) {
        if (this.imageBG === undefined) this.imageBG = new Image();
        this.imageBG.src = (path === undefined) ? '' : path;
    }

    loadImageCache (arr, name) {
        let z = 0;
        arr.forEach(path => {            
            let img = new Image(), key = getFilename(path, false);
            img.src = path;
            this.imageCache[name + '_' + key] = img;
            z++;
        });
    }

    /**
     * moves an object into the given direction
     */
    move($this, direction, milliseconds = 1000, loop = true) {
        Intervals.add (
            function move() {
                let speed = (direction == 'left') ? Math.abs($this.speed) * -1 : Math.abs($this.speed);
                $this.X += speed;
                if (loop == true) {
                    if (speed < 0 && $this.right < $this.westEnd) $this.X = $this.eastEnd;
                    if (speed > 0 && $this.X > $this.eastEnd) $this.X = $this.westEnd;
                }
            }, milliseconds / FPS, [$this], direction, loop
        );
    }

    draw (ctx, showframe) {
        try {
            ctx.drawImage(this.image, this.X, this.Y, this.width, this.height);
            if (this.type == 'chicken') this.displayHeart(ctx);
            if (this.type == 'endboss') this.displayEnergy(ctx);
            if (showframe) this.displayFrame (ctx);
        } catch (err) {
            console.warn(`ERROR in Object ${this.name}: ` + err);
            console.warn('Cache: ' + this.imageCache, 'Current Image: ' + this.image)
        }    
    }

    displayHeart (ctx) {
        if (this.isFriendly && this.isAlive) {
            ctx.drawImage(this.heart, this.X+16, this.Y-16, 16, 16);
        }        
    }

    displayEnergy (ctx) {
        if (this.isDead) return;
        if (this.energy < 100) {
            let color = this.energy >= 66 ? 'green' : this.energy >= 33 ? 'gold' : 'tomato';
            ctx.beginPath();            
            ctx.lineWidth = '1';
            ctx.strokeStyle = color;
            ctx.rect(this.X + 50, this.Y + 40, 100, 10);
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.fillRect(this.X + 50, this.Y + 41, this.energy, 8);
        }
    }

    /**
     * helper function, to be executed only in debug mode !!!
     * @param {canvas context} ctx the given context to draw
     */
    displayFrame (ctx) {
        if (this.name && (this.name == 'Pepe' || this.type == 'chicken' || this.type == 'endboss')) {
            let offsetY = this.name == 'Pepe' ? this.offsetY : 0,
                cordsRequired = this.name == 'Pepe' || 
                ((this.type == 'chicken' || this.type == 'endboss') && this.isAlive);
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'navy';
            ctx.setLineDash([5, 5]);                
            ctx.rect(this.X, this.Y + offsetY, this.width, this.height - offsetY);
            ctx.stroke();                
            if (cordsRequired) this.displayCoordinates(ctx, this.name, offsetY);            
        }      
    }
    // show the coordinates and names
    displayCoordinates (ctx, name, offsetY) {
        let isPepe = name == 'Pepe',
            showTop = isPepe ? `    Top: ${this.Y + offsetY}` : '';
        name = isPepe ? '' : name + ' ';        
        ctx.font = "12px Verdana";
        ctx.fillStyle = 'navy';
        if (this.isMirrored) this.environment.flipImage(this, true);
        ctx.fillText(`${name}`,this.X-20, this.Y-32 + offsetY);                
        ctx.fillText(`[X:${parseInt(this.X)},Y:${parseInt(this.Y)}]${showTop}`, this.X-20, this.Y-10 + offsetY);
        if (isPepe) {
            ctx.fillText(`Bottom: ${parseInt(this.bottom)} Right: ${parseInt(this.right)}`,this.right-100, this.bottom + 20);
        }                
        if (this.isMirrored) this.environment.flipImage(this, false);
    }

    /**
     * plays an animation from the given array of pictures     * 
     * @param {string} arrImages string array containing the path for the images
     * @param {string} subkey creates together with name and index the key of the image in 'imageCache' 
     */
    playAnimation (arrImages, subkey = 'wlk') {  
        const arr = arrImages.filter(img => {return img.includes(subkey)});      
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
    applyGravity ($this) {
        // returns the interval-ID! (for seed and bonus class)
        return Intervals.add (
            function gravity () {
                if ($this.isAboveGround || $this.speedY < 0 ) {
                    $this.Y += $this.speedY;
                    $this.speedY += $this.acceleration; 
                 } else {
                    $this.Y = $this.groundY;
                    $this.speedY = 0;
                } 
            }, 1000 / FPS, [$this]
        )
    }


    isCloseEnemy (enemyType) {
        // get all endbosses in the current level...
        const bosses = this.environment.level.EndBosses;       
        // now check, if one of them is close enough for a hit
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

    hit (damage) {
        this.energy -=damage;
        if (this.energy < 0) {
            this.energy = 0; 
        } else {
            this.lastHit = new Date().getTime(); // saving time stamp since last hit
        }  
    }


    timeElapsed(since) {
        return (new Date().getTime() - since) / 1000; // time elapsed in sec
    }

    isLeftFrom(obj) {
        return this.right < obj.left;
    }

    isRightFrom(obj) {
        return this.left > obj.right;
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
     * @returns COLL_TOP(12), COLL_RIGHT(3), COLL_BOTTOM(6), COLL_LEFT(9)
     */
    getCollisionSide(obj) {
        // Calculate the distance between centers
        let diffX = this.centerX - obj.centerX,
            diffY = this.centerY - obj.centerY;
        // Calculate the minimum distance to separate along X and Y
        let minDistX = this.width / 2 + obj.width / 2,
            minDistY = this.height / 2 + obj.height / 2;    
        // Calculate the depth of collision for both the X and Y axis
        let depthX = diffX > 0 ? minDistX - diffX : -minDistX - diffX,
            depthY = diffY > 0 ? minDistY - diffY : -minDistY - diffY;
    
        // having the depth, pick the smaller depth and move along that axis
        if (depthX != 0 && depthY != 0) {
            // Collision along the X-axis...
            if (Math.abs(depthX) < Math.abs(depthY)) {                
                if (depthX > 0) return COLL_LEFT;
                return COLL_RIGHT;
            // Collision along the Y-axis...    
            } else { 
                if (depthY > 0) return COLL_TOP;
                return COLL_BOTTOM;
            }
        }
        return null;
    }

    hide (intervalKey) {
        Intervals.remove(intervalKey);
        this.gravarityID = undefined;
        this.animationID = undefined;
        this.moveID = undefined;
        this.Y = CANVAS_HEIGHT * 2; // move the object out of the screen     
    }
}