import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bottle extends Mobile {
    name = 'Bottle';
    type = 'bottle';
    // imagePath = '';
    height = 70;
    width = 70;
    X = 0;
    Y = -70;
    offsetY = 0;
    groundY = 380;
    speed = 10;
    speedY = 0.5; 
    visible = false;
    onCollisionCourse = true;
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;
    gravarityID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();        
    }

    initialize() {
        this.arrAnimation = loadArray ('./img/Items/Bottles/rotation/spin',8);
        this.loadImageCache (this.arrAnimation, this.name);
    }

    throw (pX, pY, speed, mirrored = false) {
        if (this.moveID == undefined) {
            this.X = pX;
            this.Y = pY;
            this.speedY = -speed;
            this.gravarityID = this.applyGravity();
            this.animationID = this.animate();
            
            this.moveID = setInterval(() => {
                if (this.Y < this.groundY) {
                    let dir = mirrored ? -1 : 1;
                    this.X += this.speed * dir;
                } else if (this.Y >= this.groundY) {
                    this.hide();
                }            
            }, 25);
        }
    }

    animate () {      
        return setInterval(() => {
            this.playAnimation(this.arrAnimation,'spin');          
        }, 2000 / FPS);
    }
}