import Chicken from './chicken.class.js';
import EndBoss from './endboss.class.js';
import Background from './background.class.js';
import Obstracle from './obstracles.class.js';
import Cloud from './cloud.class.js';
import Item from './items.class.js';

import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import Food from './food.class.js';

export default class Level {
    constructor (number) {
        this.levelNo = number;
        this.eastEnd = (CANVAS_WIDTH - 1) * number * 5;
        this.westEnd = -this.eastEnd;
        this.initLevel();
    }

    levelNo;
    eastEnd;
    westEnd;

    Backgrounds = [];
    Clouds = [];
    Enemies = [];
    Food = [];   
    Foregrounds = [];
    Items = [];
    Obstracles = [];

    initLevel () {        
        this.initBackgrounds();
        this.initEnemies();
        this.initObstracles();       
        this.initClouds();
        this.initFood();
        this.initItems();
        
        console.log('LeveL: ', this.levelNo,this) 
        // debugger
    }

    initBackgrounds() {
        let step = CANVAS_WIDTH - 1,
            pNr = 0;   
        for (let x =  this.westEnd; x < this.eastEnd + 1; x += step) {
            this.Backgrounds.push(new Background('./img/Background/layers/sky_1920x1080.png', x));
            pNr++;
            if (pNr > 2) pNr = 1;
            for (let i = 3; i > 0; i--) {
                let path = `./img/Background/layers/background${i}/${pNr}.png`;
                this.Backgrounds.push(new Background(path, x));
            }
        }
    }

    /**
    * sets obstracles either to the background or foreground
    */
    initObstracles () {
        // load the plants
        this.Obstracles = this.add(11, Obstracle, 'cactus', 'Obstracles/Plants');
        this.Obstracles.push(...this.add(4, Obstracle, 'grass', 'Obstracles/Plants'));        
        this.Obstracles.push(...this.add(2, Obstracle, 'tree', 'Obstracles/Plants'));
        // load the stones
        this.Obstracles.push(...this.add(11, Obstracle, 'stone', 'Obstracles/Stones'));
        this.Obstracles.push(...this.add(7, Obstracle, 'stone_big', 'Obstracles/Stones'));
        // load the animals
        this.Obstracles.push(...this.add(6, Obstracle, 'spider', 'Obstracles/Animals/Spiders'));
        this.Obstracles.push(...this.add(6, Obstracle, 'scorpion', 'Obstracles/Animals/Spiders'));
        this.Obstracles.push(...this.add(14, Obstracle, 'snake', 'Obstracles/Animals/Snakes'));
        this.Obstracles.push(...this.add(3, Obstracle, 'bees', 'Obstracles/Animals/Bugs'));

        for (let i = 0; i < this.Obstracles.length; i++) {
            const item = this.Obstracles[i];
            if (item.isBackground) {
                this.Backgrounds.push(item);
            } else {
                this.Foregrounds.push(item);
            }
        }
    }

    initItems () {
         //load the items
        for (let i = 0; i < this.levelNo * 2; i++) {
            this.Items.push(...this.add (3, Item, 'bottle', 'Items/Bottles'));
            this.Items.push(...this.add (3, Item, 'coin', 'Items/Coins'));
        }
        this.Items.push(...this.add (2, Item, 'key', 'Items/Chest'));
        this.Items.push(...this.add (4, Item, 'chest', 'Items/Chest'));         
        this.Items.push(...this.add (1, Item, 'bullet', 'Items/Guns'));
        this.Items.push(...this.add (1, Item, 'beehive', 'Items/Misc'));
        this.Items.push(...this.add (9, Item, 'jar', 'Items/Misc'));
        this.Items.push(...this.add (5, Item, 'misc', 'Items/Misc'));
        this.Items.push(...this.add (4, Item, 'shop', 'Items/Misc'));
        this.Items.push(...this.add (4, Item, 'seedbag', 'Items/Seeds'));
    }

    initFood () {
        this.Food = this.add(17, Food, 'food', 'Food');
        this.Food.push(...this.add(17, Food, 'chili', 'Food/Chili'));
        this.Food.push(...this.add(10, Food, 'drink', 'Food/Drinks'));
        this.Food.push(...this.add(6, Food, 'medicine', 'Food/Medicine'));
    }

    add (count, classType, key, subfolder) {
        let arr = [],
            path = subfolder ? `./img/${subfolder}` : `./img` ;
        for (let i = 0; i < count; i++) {
            const name = key + i;
            arr.push(new classType(`${path}/${name}.png`, name, this.eastEnd));
        }
        return arr;
    }

    initEnemies() {
        let count = this.levelNo * 10 - this.levelNo * 2;
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Chicken(this.eastEnd, i));
        }
        this.Enemies.push(new EndBoss(this.eastEnd));
    }

    // Wolken evl. noch zufällig verteilen (Param: pX mit übergeben...)
    initClouds () {
        for (let i = 1; i < 3; i++) {
            this.Clouds.push(new Cloud());
        }
    }
}