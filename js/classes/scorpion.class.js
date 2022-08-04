import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';
import { FPS } from '../const.js';
import { Intervals } from "../game.js";

export default class Scorpion extends Enemy {
    height = 40;
    width = 40;
    speed = 0;

    constructor (level, index = 1) {
        super (level,'Scorpion', index);
        this.damage = 2 + Math.random() * level.levelNo;
        this.initialize();
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Spiders/scorpion3.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Spiders/scorpion',6);
        this.arrAnimation.push('./img/Obstracles/Animals/Spiders/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
        this.scorpionAnimation(this, 'scorpion', 60000);
    }

    scorpionAnimation (context, subkey, milliseconds) {
        Intervals.add (
            function scorpionAnimation() {
                context.playAnimation(context.arrAnimation, subkey)
            }, milliseconds / FPS, [context]
        );
    }
}