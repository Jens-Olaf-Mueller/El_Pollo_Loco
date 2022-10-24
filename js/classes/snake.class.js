import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';

export default class Snake extends Enemy {
    height = 50;
    width = 50;
    speed = 0;
    get animationSpeed() {return this.onCollisionCourse ? 12000 : 24000;}

    constructor (level, index = 1) {
        super(level,'Snake', index);
        this.damage = 1 + Math.random() * index * level.levelNo;
        this.initialize();    
        if (!this.isBackground) this.animate('rattle', this, this.animationSpeed);
    }


    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Snakes/rattle0.png');
        this.arrAnimation = loadArray ('./img/Obstracles/Animals/Snakes/rattle', 4);  
        this.arrAnimation.push('./img/Obstracles/Animals/Snakes/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
    }
}