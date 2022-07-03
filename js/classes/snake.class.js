import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';

export default class Snake extends Enemy {
    height = 50;
    width = 50;
    speed = 0;

    constructor (level, index = 1) {
        super (level,'Snake', index);
        this.damage = 1 + Math.random() * index * level.levelNo;
        this.initialize();
        // this.animate('snake');
    }

    initialize () {
        this.loadImage ('./img/Obstracles/Animals/Snakes/snake13.png');
        // this.arrAnimation = loadArray('./img/Obstracles/Animals/Bugs/bees',3);
        // this.loadImageCache (this.arrAnimation, this.name);
        this.setPosition(random(1, 30));
    }
}