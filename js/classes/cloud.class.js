/**
* in order to use the EXTENDED classes as module
* the extending class must be imported here!
*/
import Mobile from './mobile.class.js';

export default class Cloud extends Mobile {
    name = ''; 
    type = 'cloud';
    direction = this.fivty50 ? 'right' : 'left'; 
    height = 300;
    width = 500;

    constructor (level, index) {
        let no = 1 + parseInt(Math.random() * 1);
        super(level).loadImage(`./img/Background/layers/clouds/${no}.png`);
        this.name = 'Cloud' + index;
        this.X = this.fivty50 ? Math.random() * this.eastEnd : Math.random() * this.westEnd;
        this.Y = 1 + Math.random() * 16;
        this.speed = 0.125 + Math.random() * 0.25;    
        this.move(this, this.direction ,1000);   
    }
}