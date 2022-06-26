import Enemy from './enemy.class.js';

export default class Endboss extends Enemy {
    type = 'gallina';
    key;
    Y = 60;
    height = 400;
    width = 350; 

    constructor (level, index = 0) { 
        super(level, 'Senora Gallina', index)
        this.damage = level.levelNo * 5;
    };
}