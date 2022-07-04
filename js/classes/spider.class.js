import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';
import { FPS, CANVAS_WIDTH } from '../const.js';
import { arrIntervals } from "../game.js";

export default class Spider extends Enemy {
    height = 40;
    width = 40;
    speed = 0;

    constructor (level, index = 1) {
        super (level,'Spider', index);
        this.damage = 2 + Math.random() * level.levelNo;
        this.initialize();
        this.animate('spider');
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Spiders/spider3.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Spiders/spider',6);
        this.arrAnimation.push('./img/Obstracles/Animals/Spiders/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
    }

    animate (animationKey) {
        if (this.isAlive) {

            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation, animationKey);                 
            }, 60000 / FPS);
            arrIntervals.push(this.animationID);
        } 
    }
}