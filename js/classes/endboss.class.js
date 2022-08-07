import Enemy from './enemy.class.js';
import { Intervals } from "../game.js";
import { gameSettings } from '../settings_mod.js';
import { loadArray } from '../library.js';
import { CANVAS_WIDTH } from '../const.js';

export default class Endboss extends Enemy {
    Y = 60;
    height = 400;
    width = 350; 
    defaultSpeed = 0.15 + Math.random() * 0.25;
    bossNo = 0;
    lastAttack = 0;

    constructor (level, index = 0) { 
        super(level, 'Endboss', index)
        this.bossNo = index; // to set different X-positions
        this.initialize();
    };

    initialize() {        
        this.loadImage ('./img/Endboss/walking/wlk1.png');
        this.arrAnimation = loadArray ('./img/Endboss/walking/wlk', 4); 
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/attack/atk',8));
        this.arrAnimation.push(...loadArray('./img/Endboss/dead/die',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/hurt/hurt',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/alert/alt', 8));
        this.arrAnimation.push('./img/Endboss/dead/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = this.eastEnd + this.bossNo * CANVAS_WIDTH / 2; 
        this.speed = this.defaultSpeed;
        this.damage = this.level.levelNo * 5;
        this.runAnimation(this);
        this.move(this, 'left');
    }

    runAnimation (context) {
        Intervals.add(
            function animation() {
                if (context.isDead()) {
                    context.playAnimation (context.arrAnimation,'die');
                } else if (context.isHurt()) {
                    context.lastAttack = new Date().getTime(); // saving time stamp since last attack
                    context.playAnimation (context.arrAnimation,'hurt');
                    console.log('Endboss energy...' + context.energy)
                } else if (context.isAttacking()) {
                    context.speed = 2.75; // 3 ?
                    context.playAnimation (context.arrAnimation,'atk');     
                } else {
                    context.speed = context.defaultSpeed;
                    context.playAnimation (context.arrAnimation,'wlk');                
                }
            }, 250, [context] 
        )
    }  

    isAttacking() {
        return (this.timeElapsed(this.lastAttack) < gameSettings.endbossAttackingTime);
    }
}