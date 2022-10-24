import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';

export default class Spider extends Enemy {
    height = 40;
    width = 40;
    speed = 0;
    get animationSpeed() {return this.onCollisionCourse ? 60000 : 120000;}

    constructor (level, index = 1) {
        super (level,'Spider', index);
        this.damage = (2 + Math.random() * level.levelNo) * 0.5;
        this.initialize();        
        if (!this.isBackground) this.animate('spider', this, this.animationSpeed);
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Spiders/spider_bg.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Spiders/spider',6);
        this.arrAnimation.push('./img/Obstracles/Animals/Spiders/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
    }
}