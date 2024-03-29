import Enemy from './enemy.class.js';
import { loadArray } from '../library.js';
import { CANVAS_WIDTH } from '../const.js';

export default class Chicken extends Enemy {
    Y = 380;
    height = 60;
    width = 60;  
    heart = new Image(16,16);  

    constructor(level, index) { 
        super(level, 'Chicken', index);
        this.initialize();
        this.animate('wlk', this);
    };  

    
    initialize() {
        this.loadImage('./img/Chicken/adult/wlk0.png');
        this.heart.src= './img/Status/heart.png';
        this.arrAnimation = loadArray ('./img/Chicken/adult/wlk', 3);      
        this.arrAnimation.push('./img/Chicken/adult/dead.png');
        this.arrAnimation.push('./img/Chicken/adult/egg.png');
        this.loadImageCache (this.arrAnimation, this.name);     
        this.X = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd;
        this.speed += Math.random();
        this.damage = this.level.levelNo * 1.5;        
    }

    enlarge(increment = 2, levelNo = 1) {
        if (this.isAlive && !this.isFriendly) {
            this.width +=increment;
            this.height +=increment;
            this.Y -=increment; // make sure the chicken remains on ground-level!
            this.damage += levelNo * 0.05;
        }
    }
}