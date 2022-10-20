import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';
import { FPS } from '../const.js';
import { Intervals } from "../game.js";

export default class Spider extends Enemy {
    height = 40;
    width = 40;
    speed = 0;

    constructor (level, index = 1) {
        super (level,'Spider', index);
        this.damage = (2 + Math.random() * level.levelNo) * 0.5;
        this.initialize();        
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Spiders/spider3.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Spiders/spider',6);
        this.arrAnimation.push('./img/Obstracles/Animals/Spiders/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
        this.spiderAnimation(this, 'spider', 60000);
    }

    spiderAnimation (context, subkey, milliseconds) {
        Intervals.add (
            function spiderAnimation() {
                context.playAnimation(context.arrAnimation, subkey)
            }, milliseconds / FPS, [context]
        );
    }
}