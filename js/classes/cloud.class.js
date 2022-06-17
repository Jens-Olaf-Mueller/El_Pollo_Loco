/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';

export default class Cloud extends Mobile { 
    constructor () {
        super().loadImage('./img/Background/layers/clouds/2.png');
        this.animate();
    };   

    height = 300;
    width = 500;
    X = 10 + Math.random() * 500 + 1;
    Y = Math.random() * 15 + 1;

    animate () {
        // this.moveLeft() // old version
        let random = Math.random() * 0.125,
            startFromX = 10 + Math.random() * 500 + 1,
            startFromY = Math.random() * 20 + 1;
        this.move('left', random, startFromX, startFromY, true);
    }
}