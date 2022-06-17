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
        // console.log('LeveL: '+this.levelNo,this)    
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
        this.addObstracles(11, 'cactus', 'Plants');
        this.addObstracles(4, 'grass', 'Plants');
        this.addObstracles(2, 'tree', 'Plants');
        // load the stones
        this.addObstracles(11, 'stone', 'Stones');
        this.addObstracles(7, 'stone_big', 'Stones');
        // load the animals
        this.addObstracles(6, 'spider', 'Animals/Spiders');
        this.addObstracles(6, 'scorpion', 'Animals/Spiders');
        this.addObstracles(14, 'snake', 'Animals/Snakes');
        this.addObstracles(3, 'bees', 'Animals/Bugs');

        for (let i = 0; i < this.Obstracles.length; i++) {
            const item = this.Obstracles[i];
            if (item.isBackground) {
                this.Backgrounds.push(item);
            } else {
                this.Foregrounds.push(item);
            }
        }
    }

    addObstracles (count, key, subfolder) {
        let path = subfolder ? `./img/Obstracles/${subfolder}` : `./img/Obstracles`;
        for (let i = 0; i < count; i++) {
            const name = key + i;
            this.Obstracles.push(new Obstracle(`${path}/${name}.png`, name, this.eastEnd));
        }
    }

    initItems () {
         //load the items
        this.addItem(3, 'bottle', 'Bottles');
        this.addItem(3, 'coin', 'Coins');
        this.addItem(2, 'key', 'Chest');
        this.addItem(4, 'chest', 'Chest');
        this.addItem(1, 'bullet', 'Guns');
        this.addItem(1, 'beehive', 'Misc');
        this.addItem(2, 'jar', 'Misc');
        this.addItem(4, 'misc', 'Misc');
        this.addItem(4, 'shop', 'Misc');
        this.addItem(4, 'seedbag', 'Seeds');
    }

    addItem (count, key, subfolder) {
        let path = subfolder ? `./img/Items/${subfolder}` : `./img/Items` ;
        for (let i = 0; i < count; i++) {
            const name = key +i;
            this.Items.push(new Item(`${path}/${name}.png`, name, this.eastEnd));
        }
    }

    initFood () {
        // load the food
        for (let i = 0; i < 17; i++) {
            const name = `food${i}`;
            // const path = `./img/Food/${name}.png`;
            // console.log(path )
            this.Food.push(new Food(`./img/Food/${name}.png`,name, this.eastEnd));
        }
        // load the chili
        for (let i = 0; i < 17; i++) {
            const name = `chili${i}`;
            this.Food.push(new Food(`./img/Food/Chili/${name}.png`,name ,this.eastEnd));
        }
        // load the drinks
        for (let i = 0; i < 10; i++) {
            const name = `drink${i}`;
            this.Food.push(new Food(`./img/Food/Drinks/${name}.png`,name ,this.eastEnd));
        }
        // load the medicine
        for (let i = 0; i < 6; i++) {
            const name = `medicine${i}`;
            this.Food.push(new Food(`./img/Food/Medicine/${name}.png`,name ,this.eastEnd));
        }
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