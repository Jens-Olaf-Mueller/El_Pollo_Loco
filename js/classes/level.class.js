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
import Shop from './shop.class.js';
import Sign from './sign.class.js';
import Food from './food.class.js';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';
import { gameSettings } from '../settings_mod.js';

export default class Level {
    name = '';
    levelNo;
    eastEnd;
    westEnd;
    shop;

    Backgrounds = [];
    Clouds = [];
    Enemies = [];
    EndBosses = [];
    Food = [];   
    Foregrounds = [];
    Items = [];
    Obstracles = [];
    LastEndbossPositions = [];

    /**
     * find all endbosses in the current level, since there can be more than one...
     * A level is solved, i
     */
    get solved() {
        const aliveBosses = this.EndBosses.filter(boss => {
            // return (boss instanceof Endboss && boss.isAlive);
            return (boss.isAlive);
        }); 
        return aliveBosses.length == 0;
    }

    constructor (number, prevEndbossPosX) {
        this.levelNo = number;
        this.LastEndbossPositions = prevEndbossPosX;
        this.name = 'Level ' + number;
        this.eastEnd = (CANVAS_WIDTH - 1) * number * 5;
        this.westEnd = -this.eastEnd;
        this.initLevel();
    }

    initLevel() {        
        this.initBackgrounds();
        this.initEnemies();
        this.initObstracles();       
        this.initClouds();
        this.initFood();
        this.initItems();
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
        this.shop = new Shop('./img/Items/Shop/', this);
        this.Backgrounds.push(this.shop); 
    }

    /**
    * loads all obstracles
    */
    initObstracles () {
        // load the plants...
        let count = this.getLevelBalance(8,12,4,2);        
        this.Obstracles = this.add(count, Obstracle, 'cactus', 'Obstracles/Plants');
        this.Obstracles.push(...this.add(4, Obstracle, 'grass', 'Obstracles/Plants'));        
        this.Obstracles.push(...this.add(2, Obstracle, 'tree', 'Obstracles/Plants'));
        // stones...
        count = this.getLevelBalance(8,11,4);
        this.Obstracles.push(...this.add(count, Obstracle, 'stone', 'Obstracles/Stones'));
        this.Obstracles.push(...this.add(7, Obstracle, 'stone_big', 'Obstracles/Stones'));
        this.shiftPosition(this.Obstracles);
    }

    initItems () {
         // amount of bottles and coins depend on the level number        
        for (let i = 0; i < this.levelNo * 2; i++) {
            this.Items.push(...this.add (11, Item, 'coin', 'Items/Coins'));
        }
        let count = this.levelNo < 2 ? 5 : 2 + this.levelNo;
        for (let i = 0; i < count; i++) {
            this.Items.push(...this.add (3, Item,'bottle', 'Items/Bottles'));
        }
        // this.Items.push(new Shop('../img/Items/Misc/shop0.png',this));        
        // this.Items.push(...this.add (1, Item, 'shop', 'Items/Shop'));
        this.Items.push(...this.add (4, Item, 'chest', 'Items/Chest'));
        this.Items.push(...this.add (9, Item, 'jar', 'Items/Misc'));
        
// TODO: modulo-operator kontrollieren für sign-images 
        for (let i = 0; i < this.levelNo + 1; i++) {
            this.Items.push(new Sign(this.shop.X, i % 5, this));
        }

        count = this.getLevelBalance(2,16,4); 
        this.Items.push(...this.add (16, Item, 'misc', 'Items/Misc'));        
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

    initClouds () {
        for (let i = 1; i < 3; i++) {
            this.Clouds.push(new Cloud(this, i));
        }
    }

    initFood () {
        // let count = (this.levelNo < 11) ? 10 : 31 - this.levelNo;
        let count = this.getLevelBalance(5,21,15,1);
        // console.log('food in level ' + this.levelNo, count)
        this.Food.push(...this.add(count, Food, 'food', 'Food'));
        this.Food.push(...this.add(17, Food, 'chili', 'Food/Chili'));
        this.Food.push(...this.add(11, Food, 'drink', 'Food/Drinks'));
        this.Food.push(...this.add(6, Food, 'medicine', 'Food/Medicine'));
        // debugger
        // for (let i = 0; i < this.LastEndbossPositions.length; i++) {
        //     const name = 'food' + parseInt(25 + i);
        //     this.Food.push(new Food(`./img/Food/${name}.png`,name, this, this.LastEndbossPositions[i]));      
        // }
    }

    initEnemies() {
        for (let i = 0; i < this.levelNo * 7; i++) {
            this.Enemies.push(new Chicken(this, i));
        }
        for (let i = 0; i < this.levelNo; i++) {
            if (i % 3 == 0) {
                const boss = new Endboss(this, i)
                this.Enemies.push(boss);
                this.EndBosses.push(boss);
                this.Enemies.push(new Bees(this, i));
            }            
        }
        for (let i = 0; i < (1 + Math.random() * this.levelNo); i++) {
            this.Enemies.push(new Snake(this, i + 1));        
        }
        for (let i = 0; i < (2 + Math.random() * this.levelNo); i++) {
            this.Enemies.push(new Scorpion(this, i + 1));        
        }
        for (let i = 0; i < (3 + Math.random() * this.levelNo); i++) {
            this.Enemies.push(new Spider(this, i + 1));            
        }
        this.shiftPosition(this.Enemies); 
    }

    createChicklets (count = 0, pX, pY) {
        for (let i = 0; i < count; i++) {
            this.Enemies.push(new Chicklet(this, i, pX + random(50, CANVAS_WIDTH), pY));           
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

    /**
     * calculates the balance (amount) for the items, obstracles etc.
     * to be created  for each level
     * @param {number} minLevel minimum of level number to take effect
     * @param {*} maxValue maximum value that is returned
     * @param {*} minValue minimum value as fallback to be returned 
     * @param {*} step counter backwards
     * @returns 
     */
    getLevelBalance (minLevel, maxValue, minValue = 1, step = 1) {
        while (minLevel > this.levelNo) {
            maxValue -=step;
            if (maxValue < minValue) {
                maxValue = minValue;
                break;
            }
            minLevel -= step;
            if (minLevel <= 0) break;
        }
        return maxValue;
    }
}