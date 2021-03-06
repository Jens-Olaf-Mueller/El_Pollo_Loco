import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH, COLL_TOP, COLL_RIGHT, COLL_BOTTOM, COLL_LEFT } from '../const.js';
import { getFilename } from '../library.js';
import { gameSettings } from '../settings_mod.js';
import { Intervals } from '../game.js';

export default class Mobile {
    X = undefined;
    Y = undefined;
    width = undefined;
    height = undefined;
    speed = 0.15;           // default speed
    speedY = 0;             // gravity acceleration
    delta = {t0: null,      // to determine if we are falling (for check collision from above)
             Y0: 0,
             t1: null,
             Y1: 0
    }
    acceleration = 0.5;

    image = undefined;
    imgIndex = 0;
    imageCache = {};        // as image cache we use a jsonArray: {pictureKey: picturePath}
    isMirrored = false;     // = 'otherDirection'    
   
    lastHit = 0;            // time elapsed when Pepe was hit by an enemy last time
    // lastMove = new Date().getTime(); // time elapsed since Pepe has moved (for sleep animation)
    diedAt = undefined;

    loadImage(path) {
        if (this.image === undefined) this.image = new Image();
        this.image.src = path;
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
    move (direction, loop = true) { 
        // do we move to the left side...?
        // if so, then negate the speed
        let speed = (direction == 'left') ? this.speed * -1 : this.speed; 
        return setInterval(() => {
            this.X += speed;
            if (loop) {
                if (speed < 0 && this.X < this.westEnd) this.X = this.eastEnd;
                if (speed > 0 && this.X > this.eastEnd) this.X = this.westEnd;
            }
        }, 1000 / FPS);
    };

    moveUp (startX, speed = 1) {
        return setInterval(() => {
            this.X = startX;
            this.Y -= speed;
            if (this.Y + this.height < 0) this.hide(); // hide when top of the screen is reached
        }, 1000 / FPS);
    }

    draw (ctx, showframe) {
        try {
            if(this.image.src.toString().includes('undefined')  ) {
                debugger;
            }
            // console.log('Image.src = ' + this.image.src )

            ctx.drawImage(this.image, this.X, this.Y, this.width, this.height);
            if (this.type == 'chicken') this.displayHeart(ctx);
            if (showframe) this.displayFrame (ctx);
        } catch (err) {
            console.warn(`ERROR in Object ${this.name}: ` + err);
            console.warn('Cache: ' + this.imageCache, 'Current Image: ' + this.image)
        }    
    }

    displayHeart (ctx) {
        if (this.isFriendly && this.isAlive()) {
            ctx.drawImage(this.heart, this.X+16, this.Y-16, 16, 16);
        }        
    }

    /**
     * helper function, to be executed only in debug mode !!!
     * @param {canvas context} ctx the given context to draw
     */
    displayFrame (ctx) {
        if (this.name) {
            let isPepe = this.name == 'Pepe',
                name = isPepe ? '' : this.name + ' ',
                offsetY = isPepe ? this.offsetY : 0,
                showTop = isPepe ? `    Top: ${this.Y + offsetY}` : '';
            if (isPepe || this.type == 'chicken' || this.type == 'endboss' || this.type == 'seed') {
                ctx.beginPath();
                ctx.lineWidth = '3';
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = 'navy';
                ctx.rect(this.X, this.Y + offsetY, this.width, this.height - offsetY);
                ctx.stroke();
                // show the coordinates and names
                ctx.font = "16px Arial";
                ctx.fillStyle = 'navy';
                if (this.isMirrored) this.environment.flipImage(this, true);
                ctx.fillText(`${name}`,this.X-20, this.Y-32 + offsetY);                
                ctx.fillText(`[X:${parseInt(this.X)},Y:${parseInt(this.Y)}]${showTop}`, this.X-20, this.Y-10 + offsetY);
                if (isPepe) {
                    ctx.fillText(`Bottom: ${parseInt(this.bottom())} Right: ${parseInt(this.right())}`,this.right()-100, this.bottom()+20);
                }                
                if (this.isMirrored) this.environment.flipImage(this, false);
            }
        }      
    }

    /**
     * plays an animation from the given array of pictures     * 
     * @param {string} arrImages string array containing the path for the images
     * @param {string} subkey creates together with name and index the key of the image in 'imageCache'
     * @var {string} key for the json-array 'imageCache', created from name and image-index number  
     */
    playAnimation (arrImages, subkey = 'wlk') {  
        const arr = arrImages.filter(img => {return img.includes(subkey)});      
        this.imgIndex++;     
        if (this.imgIndex >= arr.length) this.imgIndex = 0;
        let key = this.name + '_' + subkey + this.imgIndex;        
        this.image = this.imageCache[key];

        // if (this.type == 'bees' && this.isMirrored) console.log('Bienen fliegen nach rechts...'  )
        
        // for debugging only !!
        if (this.image == undefined) {
            console.warn(`Image "${key}" von ${this.name} undefined!`, this);
            console.log('Filter-arr: ', arr);
            debugger;
        }
    }

    /**
     * Applies the gravity for the current object, if it is in the air.
     * Therefor we increase the Y-coordinate by the acceleration speed
     */
    applyGravity () {
        return setInterval(() => {            
            if (this.isAboveGround() || this.speedY < 0 ) {
                this.Y += this.speedY;
                this.speedY += this.acceleration; 
                if (this.delta.t0 == null) {
                    this.setDelta(0);
                } else {
                    this.setDelta(1);
                }           
             } else {
                this.Y = this.groundY;
                this.speedY = 0;
                this.setDelta(false);
            }           
        }, 1000 / FPS);
    }

    /**
     * sets or resets the delta-json
     * @param {number} t = 0 sets the 1st time point X, t = 1 sets the 2nd,
     * t = false => reset both points
     */
    setDelta (t) {
        if (t === false) {
            this.delta.t0 = null;
            this.delta.t1 = null;
            this.delta.Y0 = 0;
            this.delta.Y1 = 0;
        } else if (t == 0) {
            this.delta.t0 = new Date().getTime();
            this.delta.Y0 = this.Y;
        } else if (t == 1) {
            this.delta.t1 = new Date().getTime();
            this.delta.Y1 = this.Y;
        }
    } 

    /**
     * helper function for fnc 'applyGravity': determines if object is in the air
     * @returns true | false
     */
    isAboveGround (height = 0) {
        // 1. Alle Elemente holen, die bei deiner X-Koordinate liegen
        // 2. H??he von erstem Objekt nehmen, sonst height = 0
        // if (this.Y != this.groundY) debugger

        return this.Y < (this.groundY - height);
    }

    /**
     * determines, if an object is falling or not (gravity)
     * @returns true || false
     */
    isFalling () {
        // return this.delta < 0;
        return this.delta.Y1 - this.delta.Y0 < 0;
    }

    isCloseEnemy (enemyType) {
        // get all endbosses in the current level...
        const bosses = this.environment.getAllEndbosses();       
        // now check, if one of them is close enough for a hit
        let retVal = false;
        bosses.forEach(boss => {            
            let PepeIsLeft = (this.X + this.width < boss.X),
                distance = PepeIsLeft ? boss.X - (this.X + this.width) : this.X - (boss.X + boss.width);
            if (PepeIsLeft && !this.isMirrored && Math.abs(distance) <= CANVAS_WIDTH / 1.5 || 
                !PepeIsLeft && this.isMirrored && Math.abs(distance) <= CANVAS_WIDTH / 4) {
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

    isDead () {
        if (this.energy > 0)  return false;
        
        if (this.diedAt == undefined) {
            this.diedAt = new Date().getTime();
        }
        return true;
    }

    isHurt () {
        return (this.timeElapsed(this.lastHit) < 0.75);
    }

    isSleeping () {
        return (this.timeElapsed(this.lastMove) > parseInt(gameSettings.sleepTime)); 
    }

    timeElapsed (since) {
        return (new Date().getTime() - since) / 1000; // time elapsed in sec
    }

    /**
     * detects if the given object collides with the caracter.
     * @param {class} object to check collision with
     * @returns false | null for no collision; 12 | 3 | 6 | 9 for clockwise side
     */
    isColliding (obj) {
        if (!((this.X + this.width) >= obj.X && this.X <= (obj.X + obj.width) && 
             (this.Y + this.offsetY + this.height) >= obj.Y &&
             (this.Y + this.offsetY) <= (obj.Y + obj.height) && obj.onCollisionCourse)) {
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
    getCollisionSide (obj) {
        // Calculate the distance between centers
        let diffX = this.center().left - obj.center().left,
            diffY = this.center().top - obj.center().top;
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

    isInFrontOfShop (obj) {
        return obj.isShop && (this.X + this.width) >= obj.X && this.X <= (obj.X + obj.width);
    }

    hide () {
        this.visible = false; 
        this.gravarityID = clearInterval (this.gravarityID);
        this.animationID = clearInterval (this.animationID);
        this.moveID = clearInterval (this.moveID);
        this.Y = CANVAS_HEIGHT * -1; // move the object out of the screen     
    }

    top () {
        return this.Y + this.offsetY;
    }

    left () {
        return this.X;
    }

    bottom () {
        return this.Y + this.height;
    }

    right () {
        return this.X + this.width;
    }

    center () {
        return {
            top: this.Y + this.height / 2,
            left: this.X + this.width / 2            
        }
    }
}