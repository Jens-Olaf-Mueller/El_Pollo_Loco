import Enemy from './enemy.class.js';
import { loadArray, random } from '../library.js';
import { CANVAS_WIDTH, FPS } from '../const.js';

export default class Bees extends Enemy {
    home = {X: undefined, 
            Y: undefined };
    height = 33;
    width = 33;
    speed = 0;

    constructor (level, index) {
        super (level,'Bees', index);
        this.initialize();
        // this.animate('bees');
        this.fly();
    }

    initialize () {
        // this.loadImage ('./img/Obstracles/Animals/Bugs/bees0.png');
        this.loadImage ('./img/Items/Misc/beehive0.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Bugs/bees',3);
        this.loadImageCache (this.arrAnimation, this.name);        
        this.Y = 250 + Math.random() * 80;
        // this.X = random (350, this.eastEnd - CANVAS_WIDTH * 0.8); 
        this.X =0;
        this.X = Math.random() > 0.5 ? -this.X : this.X;
        this.home.X = this.X;
        this.home.Y = this.Y;
        this.speed = Math.random() * -0.25;
        this.speedY = Math.random() * -0.33;
        this.damage = this.level.levelNo * 3;
    }

    fly () {
            this.moveID = setInterval(() => {
                this.X += this.speed;
                this.Y += this.speedY;
                let distance = random(50,100);
                if (this.X < this.home.X - distance || this.X > this.home.X + distance) {
                    this.speed = this.speed * -1;
                }
                if (this.Y < this.home.Y - distance || this.Y > this.home.Y + distance ) {
                    this.speedY = this.speedY * -1;
                }
                this.isMirrored = (this.speed > 0) ? true : false;

            }, 1000 / FPS);
            

            this.animationID = setInterval(() => {
                this.playAnimation(this.arrAnimation, 'bees');                 
            }, 12000 / FPS);
        
    }
}