import Enemy from './enemy.class.js';
import Food from './food.class.js';
import { loadArray, random } from '../library.js';
import { CANVAS_WIDTH, FPS } from '../const.js';
import { Intervals } from "../game.js";

export default class Bees extends Enemy {
    height = 33;
    width = 33;
    speed = 0;
    beehive = undefined;

    constructor (level, index) {
        super (level,'Bees', index);
        this.beehive = new Food('./img/Food/food21.png','beehive' + (index + 1) * 20, level);        
        this.initialize();       
        level.Food.push(this.beehive);
        this.fly (this, 750);
        this.animate(this, 'bees', 12000);
    }

    initialize() {
        this.loadImage ('./img/Food/food16.png');
        this.arrAnimation = loadArray('./img/Obstracles/Animals/Bugs/bees',3);
        this.loadImageCache (this.arrAnimation, this.name);        
        this.Y = 250 + Math.random() * 80;
        this.X = random (350, this.eastEnd - CANVAS_WIDTH * 0.8);         
        this.X = Math.random() > 0.5 ? -this.X : this.X;
        this.beehive.X = this.X;
        this.beehive.Y = this.Y;
        this.beehive.visible = true;
        this.beehive.parent = this;
        this.speed = 0.20 + Math.random() * 0.55;
        this.speedY = 0.15 + Math.random() * 0.45;
        this.damage = this.level.levelNo * 1.75;
    }

    fly($this, milliseconds) {
        Intervals.add(
            function fly() {
                $this.X += $this.speed;
                $this.Y += $this.speedY;
                let distance = random(50, 100);
                if ($this.beehive.visible) {                
                    if ($this.X < $this.beehive.X - distance || $this.X > $this.beehive.X + distance) {
                        $this.speed = $this.speed * -1;
                    }                   
                } else if ($this.X < $this.westEnd || $this.X > $this.eastEnd) {
                     $this.speed = $this.speed * -1;
                }
    
                if ($this.Y < $this.beehive.Y - distance || $this.Y > $this.beehive.Y + distance ) {
                    $this.speedY = $this.speedY * -1;
                } 
                $this.isMirrored = ($this.speed > 0);
            }, milliseconds / FPS, [$this]
        );
    }

    animate($this, subkey, milliseconds) {
        Intervals.add(
            function beeAnimation() {
                $this.playAnimation($this.arrAnimation, subkey)
            }, milliseconds / FPS, [$this]
        );
    }
}