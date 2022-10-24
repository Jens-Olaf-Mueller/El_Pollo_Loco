/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import { Intervals } from '../game.js';
import { FPS } from '../const.js';

export default class Cloud extends Mobile {
    name = ''; 
    type = 'cloud';
    height = 300;
    width = 500;
    X = undefined;
    Y = undefined;
    speed = 0;
    eastEnd = undefined;
    westEnd = undefined;

    constructor (level, index) {
        let no = 1 + parseInt(Math.random() * 1);
        super().loadImage(`./img/Background/layers/clouds/${no}.png`);
        this.name = 'cloud' + index;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd; 
        this.initialize();        
    };   

    initialize() {
        this.X = Math.random() > 0.5 ? Math.random() * this.eastEnd : Math.random() * this.westEnd;
        this.Y = 1 + Math.random() * 16;
        this.speed = 0.125 + Math.random() * 0.25;
        this.moveLeft(this);
    }

    moveLeft($this) {
        Intervals.add(
            function moveLeft() {
                $this.X -= $this.speed;
                if ($this.right < $this.westEnd) $this.X = $this.eastEnd;
            }, 1000 / FPS, [$this]
        );
    }
}