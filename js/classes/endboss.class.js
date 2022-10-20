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
        this.bossNo = index;        // to set different X-positions
        this.isFriendly = false;    // always!
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
        this.X = this.eastEnd - (this.bossNo + 1) * CANVAS_WIDTH / 2; 
        this.speed = this.defaultSpeed;
        this.damage = this.level.levelNo * 5;
        this.runAnimation(this);
        this.move(this, 'left');
    }

    runAnimation(object) {
        Intervals.add(
            function animation() {
                if (object.isDead) {
                    object.speed = 0;
                    if (object.timeElapsed(object.diedAt) < 3.5) {    
                        object.playAnimation (object.arrAnimation,'die');
                        object.width -=20;
                        object.height -=20;
                        object.Y +=20;                        
                    } else {
                        object.remove();                        
                    }  
                } else if (object.isHurt) {
                    object.lastAttack = new Date().getTime(); // saving time stamp since last attack
                    object.playAnimation (object.arrAnimation,'hurt');
                    // console.log('Endboss energy...' + object.energy)
                } else if (object.isAttacking()) {
                    object.speed = 2.75; // 3 ?
                    object.playAnimation (object.arrAnimation,'atk');     
                } else {
                    object.speed = object.defaultSpeed;
                    object.playAnimation (object.arrAnimation,'wlk');                
                }
            }, 250, [object] 
        )
    }  

    isAttacking() {
        return (this.timeElapsed(this.lastAttack) < gameSettings.endbossAttackingTime);
    }
}