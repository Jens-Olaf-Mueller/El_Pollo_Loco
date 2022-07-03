import Enemy from './enemy.class.js';
import { loadArray } from '../library.js';
import { CANVAS_WIDTH } from '../const.js';

export default class Bees extends Enemy {
    Y = 250 + Math.random() * 80;
    height = 33;
    width = 33;
    speed = 0;

    constructor (level, index) {
        super (level,'Bees', index);
        this.initialize();
        this.animate('bees');
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Bugs/bees0.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Bugs/bees',3);
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = 0;
        this.speed = Math.random() * 0.25;
        this.damage = this.level.levelNo * 3;
    }

    fly (animationKey) {
        let speed = Math.random() * 0.25,
            startFromX = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd,
            startFromY = 380 + Math.random() * 10;

            // debugger

        if (this.isAlive) {
            this.moveID = this.move('left', speed, startFromX, startFromY);

            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation, animationKey);                 
            }, 12000 / FPS);
        } 
    }
}