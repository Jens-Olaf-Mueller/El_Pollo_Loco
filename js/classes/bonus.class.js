import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { Intervals } from '../game.js';
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bonus extends Mobile {
    name = 'Bonus';
    height = 50;
    width = 50;
    X = 0;
    Y = -100;
    speedY = 10;  
    speed = 2.25;
    arrAnimation = [];
    animationID = undefined;
    moveID = undefined;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.arrAnimation = loadArray ('./img/Status/Bonus/spin', 16);
        this.loadImageCache (this.arrAnimation, this.name);
    }

    animate (pX, pY) { 
        if ( this.moveID == undefined) { 
            this.X = pX;
            this.Y = pY;
            this.moveID = this.moveUp(this, this.speed);
            this.animationID = this.runAnimation(this);
        }
    }

    moveUp (Me, speed) {
        return Intervals.add(
            function move() {
                Me.Y -= Math.abs(speed);
                if (Me.Y + Me.height < 0) Me.hide(Me.name); // hide when top of the screen is reached
            }, 1000 / FPS, [Me]
        );
    } 

    runAnimation (Me) {
        return Intervals.add(
            function spin() {
                Me.playAnimation(Me.arrAnimation, 'spin');
            }, 5000 / FPS, [Me]             
        );
    }
}