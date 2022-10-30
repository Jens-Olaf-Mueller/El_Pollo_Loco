import Mobile from './mobile.class.js';
import { loadArray } from "../library.js";
import { Intervals } from '../game.js';
import { FPS, CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';

export default class Bonus extends Mobile {
    name = 'Bonus';
    type = 'bonus';
    text = '';
    X = 0;
    Y = -100;
    height = 50;
    width = 50;    
    speedY = 10;  
    speed = 2.25;

    constructor (imgPath) {        
        super().loadImage(imgPath);
        this.arrAnimation = loadArray ('./img/Status/Bonus/spin', 16);
        this.loadImageCache (this.arrAnimation, this.name);
    }

    animate(pX, pY, text) { 
        if ( this.moveID == undefined) { 
            this.X = pX;
            this.Y = pY;
            this.text = text;
            this.moveID = this.moveUp(this);
            this.animationID = this.runAnimation(this);
        }
    }

    moveUp($this) {
        return Intervals.add(
            function move() {
                $this.Y -= Math.abs($this.speed);
                if ($this.Y + $this.height < 0) $this.hide($this.name); // hide when top of the screen is reached
            }, 1000 / FPS, $this
        );
    } 

    runAnimation($this) {
        return Intervals.add(
            function spin() {
                $this.playAnimation($this.arrAnimation, 'spin');
            }, 5000 / FPS, $this             
        );
    }
}