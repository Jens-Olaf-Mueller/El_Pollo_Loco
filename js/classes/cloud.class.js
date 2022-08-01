/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';
import { arrIntervals, Intervals } from '../game.js';
import { FPS } from '../const.js';

export default class Cloud extends Mobile { 
    type = 'cloud';
    height = 300;
    width = 500;
    X = undefined;
    Y = undefined;
    speed = 0;
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
        this.X = Math.random() > 0.5 ? Math.random() * this.eastEnd : Math.random() * this.westEnd;
        this.Y = 1 + Math.random() * 16;
        this.speed = Math.random() * -0.125;
    }

    animate () {
        arrIntervals.push(this.move('left',true));
        // this.moveLeft(this.X, this.speed, this.eastEnd);
    }

    moveLeft (pX, speed, eastend) {
        Intervals.add(
            function moveLeft(pX, speed, eastend) {
                pX += speed;
                if (pX < -eastend) pX = eastend;
                console.log('X ist: ' , pX );
            }, 1000 / FPS, [pX, speed, eastend, this]
        )
    }

    // setInterval(function moveLeft(pX, speed, eastend){
    //     console.log(a + b +c); 
    // }, 500, 1,2,3);

    // note the console will  print 6
    // here we are passing 1,2,3 for a,b,c arguments
}