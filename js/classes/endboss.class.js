import Enemy from './enemy.class.js';
import { arrIntervals, Intervals } from "../game.js";
import { loadArray } from '../library.js';
import { FPS, CANVAS_WIDTH } from '../const.js';

export default class Endboss extends Enemy {
    Y = 60;
    height = 400;
    width = 350; 
    defaultSpeed = 0;
    bossNo = 0;
    lastAttack = 0;

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
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/attack/atk',8));
        this.arrAnimation.push(...loadArray('./img/Endboss/dead/die',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/hurt/hurt',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/alert/alt', 8));
        this.arrAnimation.push('./img/Endboss/dead/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = this.eastEnd + this.bossNo * CANVAS_WIDTH / 2; 
        this.defaultSpeed =  0.25 + Math.random() * 0.25;      
        this.speed = this.defaultSpeed;
        this.damage = this.level.levelNo * 5;
    }

    runAnimation () {
        this.animationID = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation (this.arrAnimation,'die');
            } else if (this.isHurt()) {
                this.lastAttack = new Date().getTime(); // saving time stamp since last attack
                this.playAnimation (this.arrAnimation,'hurt');
                console.log('Endboss energy...' + this.energy)
            } else if (this.isAttacking()) {
                this.speed += 2.5;
                this.playAnimation (this.arrAnimation,'atk');     
            } else {
                this.speed = this.defaultSpeed;
                this.playAnimation (this.arrAnimation,'wlk');                
            }
        }, 250);
        this.moveID = this.moveLeft();
    }

    isAttacking() {
        return (this.timeElapsed(this.lastAttack) < 2.5); // TODO: Settings --> Endboss attacking time...
    }

    moveLeft() {
        return setInterval(() => {
            this.X -= this.speed;
        }, 12000 / FPS);
    }
}