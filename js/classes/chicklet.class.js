import Enemy from './enemy.class.js';
import { loadArray } from '../library.js';
import { CANVAS_WIDTH } from '../const.js';

export default class Chicklet extends Enemy {
    X = undefined;
    Y = undefined; 
    groundY = 410; 
    acceleration = 0.33; 
    height = 35;
    width = 35;  

    constructor (level, index, pX, pY = 0) { 
        super(level, 'Chicklet', index);
        this.X = pX === undefined ? CANVAS_WIDTH / 2 + Math.random() * this.eastEnd : pX;
        this.Y = pY;
        this.initialize();
        this.applyGravity(this);
        this.animate('wlk', this);
    };  

    initialize () {
        this.loadImage ('./img/Chicken/chicklets/wlk0.png');
        this.arrAnimation = loadArray ('./img/Chicken/chicklets/wlk', 3);      
        this.arrAnimation.push('./img/Chicken/chicklets/dead.png');
        this.loadImageCache (this.arrAnimation, this.name); 
        this.speed = 0.4 + Math.random();
        this.damage = this.level.levelNo * 0.5;        
    }
}