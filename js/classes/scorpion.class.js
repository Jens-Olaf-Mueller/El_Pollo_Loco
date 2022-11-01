import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';

export default class Scorpion extends Enemy {
    height = 35;
    width = 35;
    speed = 0;
    get animationSpeed() {return this.onCollisionCourse ? 120000 : 240000;}

    constructor (level, index = 1) {
        super (level,'Scorpion', index);
        this.damage = (2 + Math.random() * level.levelNo) * 0.666;
        this.initialize();
        if (!this.isBackground) this.animate('scorpion', this, this.animationSpeed);
    }

    initialize() {
        this.loadImage ('./img/Obstacles/Animals/Spiders/scorpion_bg.png');
        this.arrAnimation = loadArray('./img/Obstacles/Animals/Spiders/scorpion',6);
        this.arrAnimation.push('./img/Obstacles/Animals/Spiders/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
    }
}