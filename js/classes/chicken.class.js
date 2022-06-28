import Enemy from './enemy.class.js';

export default class Chicken extends Enemy {
    type = 'frida';
    Y = 380;
    height = 60;
    width = 60; 

    constructor (level, index) { 
        super(level, 'Frida ', index)
        this.damage = level.levelNo * 3;
    };  
}