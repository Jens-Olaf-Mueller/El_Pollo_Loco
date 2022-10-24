import Mobile from './mobile.class.js';
import { FPS } from '../const.js';
import { Sounds, Intervals } from '../game.js';
import { loadArray } from "../library.js";

export default class Bottle extends Mobile {
    name = 'Bottle';
    type = 'bottle';
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
    burstID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.initialize();
    }

    initialize() { 
        this.arrAnimation = loadArray ('./img/Items/Bottles/rotation/spin',8);
        this.arrAnimation.push(...loadArray('./img/Items/Bottles/splash_salsa/splash',6));
        this.loadImageCache (this.arrAnimation, this.name);
    }

    throw(pX, pY, speed, mirrored = false) {
        if( this.moveID == undefined) {
            // Sounds.play('bottle');
            this.X = pX;
            this.Y = pY;
            this.speedY = -speed;
            this.gravarityID = this.applyGravity(this);
            this.animationID = this.animate(this);   
            this.burstID = this.burst(this);
            this.moveID = this.move(this, mirrored);
        }
    }

    animate($this) {     
        return Intervals.add(
            function animate() {
                $this.playAnimation($this.arrAnimation, 'spin'); 
            }, 2000 / FPS, [$this]
        );
    }

    burst($this) {
        return Intervals.add(
            function splash() {
                $this.playAnimation($this.arrAnimation, 'splash');
            }, 1500 / FPS, [$this]
        );
    }

    move($this, mirrored) {
        return Intervals.add(
            function move() {
                if ($this.Y < $this.groundY) {
                    let dir = mirrored ? -1 : 1;
                    $this.X += $this.speed * dir;
                } else if ($this.Y >= $this.groundY) {
                    $this.hide($this.name);
                }   
            }, 25, [$this]
        );
    }
}