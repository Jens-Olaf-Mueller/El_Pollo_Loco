import Chicken from './chicken.class.js';
import Chicklet from './chicklet.class.js';
import Endboss from './endboss.class.js';
import Snake from './snake.class.js';
import Spider from './spider.class.js';
import Scorpion from './scorpion.class.js';

import Bees from './bees.class.js';
import Background from './background.class.js';
import Obstracle from './obstracles.class.js';
import Cloud from './cloud.class.js';
import Item from './items.class.js';
import Food from './food.class.js';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';
import { gameSettings } from '../settings_mod.js';
// import { gameSettings } from '../game.js';

export default class Level {
    name = '';
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
    // Boni = [];

    constructor (number) {
        this.levelNo = number;
        this.name = 'Level ' + number;
        this.eastEnd = (CANVAS_WIDTH - 1) * number * 5;
        this.westEnd = -this.eastEnd;
        this.initLevel();
    }

    initLevel () {        
        this.initBackgrounds();
        this.initEnemies();
        this.initObstracles();       
        this.initClouds();
        this.initFood();
        this.initItems();
        if (gameSettings.debugMode) {
            console.log('LeveL: ' + this.levelNo + ' init...', this);
            // debugger;
        }
    }

    initBackgrounds() {
        let step = CANVAS_WIDTH - 1,
            pNr = 0;   
        for (let x =  this.westEnd; x < this.eastEnd + 1; x += step) {
            this.Backgrounds.push(new Background('./img/Background/layers/sky_1920x1080.png', x, this));
            pNr++;
            if (pNr > 2) pNr = 1;
            for (let i = 3; i > 0; i--) {
                let path = `./img/Background/layers/background${i}/${pNr}.png`;
                this.Backgrounds.push(new Background(path, x, this));
            }
        }
    }

    /**
    * loads all obstracles
    */
    initObstracles () {
        // load the plants...
        this.Obstracles = this.add(11, Obstracle, 'cactus', 'Obstracles/Plants');
        this.Obstracles.push(...this.add(4, Obstracle, 'grass', 'Obstracles/Plants'));        
        this.Obstracles.push(...this.add(2, Obstracle, 'tree', 'Obstracles/Plants'));
        // stones...
        this.Obstracles.push(...this.add(11, Obstracle, 'stone', 'Obstracles/Stones'));
        this.Obstracles.push(...this.add(7, Obstracle, 'stone_big', 'Obstracles/Stones'));
        this.shiftPosition(this.Obstracles);
    }

    initItems () {
         // amount of bottles and coins depend on the level number
        for (let i = 0; i < this.levelNo * 2; i++) {
            this.Items.push(...this.add (3, Item, 'bottle', 'Items/Bottles'));
            this.Items.push(...this.add (10, Item, 'coin', 'Items/Coins'));
        }
        this.Items.push(...this.add (2, Item, 'key', 'Items/Chest'));
        this.Items.push(...this.add (4, Item, 'chest', 'Items/Chest'));         
        this.Items.push(...this.add (1, Item, 'bullet', 'Items/Guns'));
        this.Items.push(...this.add (1, Item, 'beehive', 'Items/Misc'));
        this.Items.push(...this.add (9, Item, 'jar', 'Items/Misc'));
        this.Items.push(...this.add (16, Item, 'misc', 'Items/Misc'));
        this.Items.push(...this.add (1, Item, 'shop', 'Items/Misc'));
        this.Items.push(...this.add (4, Item, 'seedbag', 'Items/Seeds'));
        // make sure we got at least one key and gun in each level!
        this.hideItem('key','jar');
        this.hideItem('gun','chest');
        this.shiftPosition(this.Items);
    }
    
    hideItem (content, container) {
        let found = false;
        this.Items.forEach(bin => {
            found = (bin.type == container) && (bin.contains == content);        
        });
        if (found) return;
        // no key or gun hidden by random, so we force it!
        for (let i = 0; i < this.Items.length; i++) {
            const bin = this.Items[i];
            if (bin.type == container) {
                bin.contains = content;
                break;
            }
        }
    }

    // Wolken evl. noch zufällig verteilen (Param: pX mit übergeben...)
    initClouds () {
        for (let i = 1; i < 3; i++) {
            this.Clouds.push(new Cloud(this));
        }
    }

    initFood () {
        this.Food.push(...this.add(17, Food, 'food', 'Food'));
        this.Food.push(...this.add(17, Food, 'chili', 'Food/Chili'));
        this.Food.push(...this.add(10, Food, 'drink', 'Food/Drinks'));
        this.Food.push(...this.add(6, Food, 'medicine', 'Food/Medicine'));
    }

    initEnemies() {
        let count = this.levelNo * 10 - this.levelNo * 3;
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Chicken(this, i));
        }
        for (let i = 0; i < this.levelNo; i++) {
            if (i % 3 == 0) {
                this.Enemies.push(new Endboss(this, i));
            }            
        }
        count = this.levelNo + (3 + Math.random() * this.levelNo);
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Snake(this, i + 1));        
        }
        count = this.levelNo + (5 + Math.random() * this.levelNo);
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Spider(this, i + 1));        
            this.Enemies.push(new Scorpion(this, i + 1));        
        }

        // this.createChicklets(2,300);

        this.Enemies.push(new Bees(this,0));
        this.shiftPosition(this.Enemies); 
    }

    createChicklets (count = 0, pX, pY) {
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Chicklet(this, i, pX, pY));           
        }
    }

    /**
     * helper function for: initObstracles(), initFood().
     * @param {integer} count the amount of objects to be loades
     * @param {object} classType the kind of class instance to be created
     * @param {string} key value to create an unique key as identifyer for name
     * @param {string} subfolder path, where the image is located
     * @returns array of new created objects
     */
    add (count, classType, key, subfolder) {
        let arr = [],
            path = subfolder ? `./img/${subfolder}` : `./img`;
        for (let i = 0; i < count; i++) {
            const name = key + i;
            arr.push(new classType(`${path}/${name}.png`, name, this));
        }
        return arr;
    }

    /**
     * moves the objects either in fore- or background,
     * depending on it's given state on initializing
     */
    shiftPosition (arrObjects) {
        for (let i = arrObjects.length - 1; i >= 0 ; i--) {
            const item = arrObjects[i];
            if (item.isBackground) {
                this.Backgrounds.push(item);
                arrObjects.splice(i, 1);
            } else {
                this.Foregrounds.push(item);
            }         
        }
    }
}