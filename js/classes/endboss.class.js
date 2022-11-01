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
    hurtDelay = 1.5;

    constructor (level, index = 0) { 
        super(level, 'Endboss', index)
        this.bossNo = index;        // to set different X-positions
        this.isFriendly = false;    // attacks always, even in debug mode!
        this.initialize();
    };

    initialize() {        
        this.loadImage ('./img/Endboss/walking/wlk1.png');
        this.arrAnimation = loadArray ('./img/Endboss/walking/wlk', 4); 
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/attack/atk', 8));
        this.arrAnimation.push(...loadArray('./img/Endboss/dead/die',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/hurt/hurt',3));
        this.arrAnimation.push(...loadArray('./img/Endboss/attack/alert/alt', 8));
        this.arrAnimation.push('./img/Endboss/dead/dead.png');
        this.loadImageCache (this.arrAnimation, this.name);
        this.X = this.eastEnd - (this.bossNo + 1) * CANVAS_WIDTH / 2; 
        this.speed = this.defaultSpeed;
        this.damage = this.level.levelNo * 5;
        this.runAnimation(this);
        this.move(this);
    }

    runAnimation($this) {
        Intervals.add(
            function animation() {
                if ($this.isDead) {
                    $this.speed = 0;
                    if ($this.timeElapsed($this.diedAt) < 3.5) {    
                        $this.playAnimation ($this.arrAnimation, 'die');
                        $this.width -=20;
                        $this.height -=20;
                        $this.Y +=20;                        
                    } else {
                        $this.remove();                        
                    }  
                } else if ($this.isHurt) {
                    $this.lastAttack = new Date().getTime(); // saving time stamp since last attack
                    $this.playAnimation ($this.arrAnimation,'hurt');
                } else if ($this.isAttacking()) {
                    $this.speed = 2.75; // 3 ?
                    $this.playAnimation ($this.arrAnimation,'atk');     
                } else {
                    $this.speed = $this.defaultSpeed;
                    $this.playAnimation ($this.arrAnimation,'wlk');                
                }
            }, 250, $this 
        )
    }  

    isAttacking() {
        return (this.timeElapsed(this.lastAttack) < gameSettings.endbossAttackingTime);
    }
}