/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import { arrIntervals } from '../game.js';

export default class Cloud extends Mobile { 
    height = 300;
    width = 500;
    X = undefined;
    Y = undefined;
    eastEnd = undefined;
    westEnd = undefined;

    constructor (level) {
        super().loadImage('./img/Background/layers/clouds/2.png');
        this.eastEnd = level.eastEnd;
        this.westEnd = level.westEnd; 
        this.initialize();
        this.animate();
    };   

    initialize() {
        this.X = Math.random() * this.eastEnd;
        this.X = Math.random() > 0.5 ? this.X : this.X * -1;
        this.Y = 1 + Math.random() * 16;
    }

    animate () {
        let random = Math.random() * 0.125,
            startFromX = 10 + Math.random() * 500 + 1,
            startFromY = Math.random() * 20 + 1;
        arrIntervals.push(this.move('left', random, startFromX, startFromY, true));
    }
}