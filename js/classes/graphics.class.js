import { getFilename } from '../library.js';

export default class Graphics {
    X = undefined;
    Y = undefined;
    offsetY = 0;
    width = undefined;
    height = undefined;
    
    image = undefined;    
    imageBG = undefined;
    imgIndex = 0;
    imageCache = {};        // as image cache we use a jsonArray: {pictureKey: picturePath}
    isMirrored = false;     // = 'otherDirection'


    loadImage(path) {
        if (this.image === undefined) this.image = new Image();
        this.image.src = (path === undefined) ? '' : path;
    }


    loadBackgroundImage(path) {
        if (this.imageBG === undefined) this.imageBG = new Image();
        this.imageBG.src = (path === undefined) ? '' : path;
    }


    loadImageCache(arr, name) {
        let z = 0;
        arr.forEach(path => {            
            let img = new Image(), key = getFilename(path, false);
            img.src = path;
            this.imageCache[name + '_' + key] = img;
            z++;
        });
    }


    draw(ctx, showframe) {
        try {
            ctx.drawImage(this.image, this.X, this.Y, this.width, this.height);
            if (this.type == 'chicken') this.displayHeart(ctx);
            if (this.type == 'endboss') this.displayEnergy(ctx);
            if (this.type == 'bonus') this.displayBonusText(ctx);
            if (showframe) this.displayFrame (ctx);
        } catch (err) {
            console.warn(`ERROR in Object ${this.name}: ` + err);
            console.warn('Cache: ' + this.imageCache, 'Current Image: ' + this.image)
        }    
    }


    displayHeart(ctx) {
        if (this.isDead) return;
        if (this.isFriendly) ctx.drawImage(this.heart, this.X+16, this.Y-16, 16, 16);
    }


    displayEnergy(ctx) {
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

    
    displayBonusText(ctx) {
        ctx.font = '26px Zabars';
        ctx.fillStyle = '#f82814'; // color of 'bonus'-text
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.X + 24, this.bottom + 20);
    }


    /**
     * helper function, to be executed only in debug mode !!!
     * @param {canvas context} ctx the given context to draw on
     */
    displayFrame(ctx) {
        let hasFrame = this.name && (this.name == 'Pepe' || this.type == 'chicken' || this.type == 'endboss');
        if (hasFrame) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'navy';
            ctx.setLineDash([5, 5]);
            ctx.rect(this.X, this.top, this.width, this.height - this.offsetY);
            ctx.stroke();                           
            this.displayCoordinates(ctx, this.name, this.offsetY);            
        }      
    }


    /**
     * helper function, to be executed only in debug mode !!!
     * show the coordinates and names of the object
     * @param {*} ctx the given context to draw on
     * @param {*} name object's name
     * @param {*} offsetY Y-position where to display the coordinates
     */
    displayCoordinates(ctx, name, offsetY) {
        let isPepe = name == 'Pepe',
            showTop = isPepe ? `    Top: ${this.Y + offsetY}` : '';
        name = isPepe ? '' : name + ' ';        
        ctx.font = "12px Verdana";
        ctx.fillStyle = 'navy';
        if (this.isMirrored) this.environment.flipImage(this, true);
        // ctx.fillText(`${name}`,this.X-20, this.Y-32 + offsetY);                
        ctx.fillText(`${name}`,this.X, this.Y-32 + offsetY);                
        ctx.fillText(`[X:${parseInt(this.X)},Y:${parseInt(this.Y)}]${showTop}`, this.X, this.Y-10 + offsetY);
        if (isPepe) {
            ctx.fillText(`Bottom: ${parseInt(this.bottom)} Right: ${parseInt(this.right)}`,this.X, this.bottom + 20);
        }                
        if (this.isMirrored) this.environment.flipImage(this, false);
    }
}