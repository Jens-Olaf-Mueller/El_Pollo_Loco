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
    direction = this.fivty50 ? 'right' : 'left'; 
    height = 300;
    width = 500;
    speed = 0;
    eastEnd = undefined;
    westEnd = undefined;

    constructor (level, index) {
        let no = 1 + parseInt(Math.random() * 1);
        super().loadImage(`./img/Background/layers/clouds/${no}.png`);
        this.name = 'Cloud' + index;
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd; 
        this.initialize();     
        this.move(this, this.direction ,1000);   
    };   

    initialize() {
        this.X = this.fivty50 ? Math.random() * this.eastEnd : Math.random() * this.westEnd;
        this.Y = 1 + Math.random() * 16;
        this.speed = 0.125 + Math.random() * 0.25;
    }
}