import Mobile from './mobile.class.js';
import { FPS } from '../const.js';
import { Sounds, Intervals } from '../game.js';
import { loadArray } from '../library.js';

export default class Seed extends Mobile {
    name = 'Seed';
    type = 'seed';
    height = 40;
    width = 55;
    X = 0;
    Y = -40;
    offsetY = 0;
    groundY = 380;
    speed = 8;
    speedY = 0.125; 
    acceleration = 0.125;
    onCollisionCourse = true;
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;
    gravarityID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.arrAnimation = loadArray ('./img/Seed/seed',4);
        this.loadImageCache (this.arrAnimation, this.name);
    }

    throw (pX, pY, speed, mirrored = false) {
        if( this.moveID == undefined) {
            Sounds.play('seed');
            this.X = pX;
            this.Y = pY;
            this.speedY = -speed;
            this.gravarityID = this.applyGravity(this);
            this.animationID = this.animate(this);   
            this.moveID = this.move(this, mirrored);
        }
    }

    animate (Me) {     
        return Intervals.add (
            function animate () {
                Me.playAnimation(Me.arrAnimation, 'seed'); 
            }, 2000 / FPS, [Me]
        );
    }

    move (Me, mirrored) {
        return Intervals.add (
            function move() {
                if (Me.Y < Me.groundY) {
                    let dir = mirrored ? -1 : 1;
                    Me.X += Me.speed * dir;
                } else if (Me.Y >= Me.groundY) {
                    Me.hide(Me.name);
                }   
            }, 25, [Me]
        );
    }
}