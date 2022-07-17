import Enemy from './enemy.class.js';
import { arrIntervals } from "../game.js";
import { loadArray } from '../library.js';
import { FPS, CANVAS_WIDTH } from '../const.js';

export default class Endboss extends Enemy {
    Y = 60;
    height = 400;
    width = 350; 
    bossNo = 0;

    constructor (level, index = 0) { 
        super(level, 'Endboss', index)
        this.bossNo = index; // to set different X-positions
        this.initialize();
        this.runAnimation();
        arrIntervals.push(this.moveID , this.animationID);
    };

    initialize() {        
        this.loadImage ('./img/Endboss/walking/wlk1.png');
        this.arrAnimation = loadArray ('./img/Endboss/walking/wlk', 4); 
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/attack/att',8));
        this.arrAnimation.push(...loadArray('./img/Endboss/dead/die',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/hurt/hurt',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/alert/alt', 8));
        this.arrAnimation.push('./img/Endboss/dead/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = this.eastEnd + this.bossNo * CANVAS_WIDTH;        
        this.speed = 0.25 + Math.random() * 0.25;
        this.damage = this.level.levelNo * 5;
    }

    runAnimation () {
        this.animationID = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation (this.arrAnimation,'die');
                // this.speed = 0;
            } else if (this.isHurt()) {
                this.playAnimation (this.arrAnimation,'hurt');
                console.log('Endboss hurt...' + this.energy)
            } else {
                this.playAnimation (this.arrAnimation,'wlk');                
            }
        }, 250);
        this.moveID = this.moveLeft();
    }

    moveLeft() {
        return setInterval(() => {
            this.X -= this.speed;
        }, 12000 / FPS);
    }
}