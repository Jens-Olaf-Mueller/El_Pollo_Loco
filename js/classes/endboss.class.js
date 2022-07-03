import Enemy from './enemy.class.js';
import { arrIntervals } from "../game.js";
import { loadArray } from '../library.js';

export default class Endboss extends Enemy {
    Y = 60;
    height = 400;
    width = 350; 

    constructor (level, index = 0) { 
        super(level, 'Endboss', index)
        this.initialize();
        this.animate('wlk');
    };

    initialize() {        
        this.loadImage ('./img/Endboss/walking/wlk1.png');
        this.arrAnimation = loadArray ('./img/Endboss/walking/wlk', 4); 
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/attack/att',8));
        this.arrAnimation.push(...loadArray('./img/Endboss/dead/die',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/alert/alt', 8));
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = this.eastEnd;
        this.speed = 0.15 + Math.random() * 0.5;
        this.damage = this.level.levelNo * 5;
    }
}