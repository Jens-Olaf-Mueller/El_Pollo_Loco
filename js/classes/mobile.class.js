import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';
import { loadArray, getFilename } from '../library.js';

export default class Mobile {
    X = undefined;
    Y = undefined;
    speed = 0.15;           // default speed
    speedY = 0;             // gravity acceleration
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
            // console.log('Key: ' + key, 'Path: ' + path )
            z++;
        });
    }

    /**
     * moves an object into the given direction
     * @param {string} direction where we move to [ left | right ]
     * @param {integer} randomSpeed additional integer value for moving speed
     * @param {integer} startX only used when loop = true, start loop from X
     * @param {integer} startY only used when loop = true, start loop from Y
     * @param {boolean} loop repeat the move or not [ true | false]
     */
    move (direction, randomSpeed, startX, startY, loop) { 
        let moveLeft = (direction == 'left'),             // do we move to left or right?
            pixels = moveLeft ? -this.speed : this.speed; // if left, then negate the speed

        // if a random speed is provided, we add it to the normal speed
        if (randomSpeed) {
            if (moveLeft) randomSpeed = -randomSpeed;
            pixels += randomSpeed;
        }

        return setInterval(() => {
            this.X += pixels;
            if (loop) {
                if (moveLeft && this.X <= -this.width || !moveLeft && this.X > CANVAS_WIDTH) { 
                    this.X = startX;
                    this.Y = startY;
                }
            }
        }, 1000 / FPS);
    };

    moveUp (startX) {
        return setInterval(() => {
            this.X = startX;
            this.Y -= this.speed * 15;
            if (this.Y < -this.height) this.animate(false);
        }, 1000 / FPS);
    }

    draw (ctx, showframe) {
        try {
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
            if (isPepe || this.type == 'chicken' || this.type == 'endboss') {
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
        
        // for debugging only !!
        if (this.image == undefined) {
            console.warn(`Image "${key}" von ${this.name} undefined!`, this);
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
             } else {
                this.Y = this.groundY;
                this.speedY = 0;
            }           
        }, 1000 / FPS);
    }

    /**
     * helper function for fnc 'applyGravity': determines if object is in the air
     * @returns true | false
     */
    isAboveGround (height = 0) {
        // 1. Alle Elemente holen, die bei deiner X-Koordinate liegen
        // 2. Höhe von erstem Objekt nehmen, sonst height = 0
        // if (this.Y != this.groundY) debugger

        return this.Y < (this.groundY - height);
    }

    isClose (enemyType) {
        // find all endbosses in the current level...
        const bosses = this.environment.arrEnemies.filter(e => {
            return (e.type == enemyType);
        });
        let retVal = false;
        // now check, if one of them is close enough for a hit
        bosses.forEach(boss => {
            // debugger
            // console.log('Pepe-left: ' , this.X, 'right: ', this.right())
            // console.log('Boss-left: ' , boss.X, 'right: ',  boss.X + boss.width)

            // if (this.right() < boss.X) {
            //     console.log('Diff. links vom Endboss ' , boss.X - this.right())
            //     // debugger
            // } else if (this.right() > boss.X + boss.width) {
            //     console.log('Diff. rechts vom Endboss: ' , this.X - (boss.X + boss.width))
            //     // debugger
            // }

            if (!this.isMirrored && boss.X - this.right() <= CANVAS_WIDTH / 2 ||
                this.isMirrored && this.X - (boss.X + boss.width) <= CANVAS_WIDTH / 4) {
                retVal = true;
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
        return (this.timeElapsed(this.lastMove) > 7); // gameSettings.SleepTime...
    }

    timeElapsed (since) {
        return (new Date().getTime() - since) / 1000; // time elapsed in sec
    }

    /**
     * detects if the given objects collides with the caracter.
     * collision is detected if: 
     * > the right border is equal or bigger than object's X-coordinate (left side)
     * > the bottom of the character is bigger than the object's Y-coordinate (top)
     * > 
     * >
     * @param {class} object to check collision with
     * @returns true | false
     */
    isColliding (obj) {
        return  (this.X + this.width) >= obj.X && this.X <= (obj.X + obj.width) && 
                (this.Y + this.offsetY + this.height) >= obj.Y &&
                (this.Y + this.offsetY) <= (obj.Y + obj.height) && 
                obj.onCollisionCourse;
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
}