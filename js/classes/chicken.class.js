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
        this.loadImage ('./img/Chicken/adult/wlk0.png');
        this.heart.src= './img/Status/heart.png';
        this.arrAnimation = loadArray ('./img/Chicken/adult/wlk', 3);      
        this.arrAnimation.push('./img/Chicken/adult/dead.png');
        this.arrAnimation.push('./img/Chicken/adult/egg.png');
        this.loadImageCache (this.arrAnimation, this.name);     
        this.X = CANVAS_WIDTH / 2 + Math.random() * this.eastEnd;
        this.speed = 0.15 + Math.random();
        this.damage = this.level.levelNo * 1.5;        
    }
}