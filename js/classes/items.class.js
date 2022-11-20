import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../const.js';
import { random } from '../library.js';
import Background from './background.class.js';

export default class Item extends Background {
    name = '';
    type = '';
    visible = true;
    isBackground = false;
    onCollisionCourse = true;
    value;
    height = 70;
    width = 70;
    contains = null;
    canJumpOn = false;


    constructor (imgPath, name, level) { 
        super(imgPath, name, level);      
        this.name = name;
        // RegEx '/[^0-9]/g' returns only a number from string: 'food4' => 4
        this.value = parseInt(name.replace(/[^0-9]/g,'')) || 0; 
        this.type = name.replace(/[0-9]/g, '');      
        this.initialize();
    }
    

    enabled(state) {
        if (state === false) {
            this.visible = false; 
            this.value = 0;       
            this.height = 0;
            this.width = 0;
            this.X = Infinity;
            this.Y = Infinity;
            return;
        }
        this.initialize();
    }

    initialize() {
        this.X = random (150, this.eastEnd - 75);
        this.X = this.fivty50 ? -this.X : this.X;
        switch (this.type) {
            case 'bottle': this.Y = 370;                
                break;
            case 'chest': this.initChestProperties();
                break;
            case 'jar':   this.initJarProperties();
                break;
            case 'misc':  this.initMiscProperties();
                break;
            default: this.enabled(false);
                break;
        }
        this.home.X = this.X;
        this.home.Y = this.Y;
    }
    

    initChestProperties() {
        this.height = 80;
        this.width = 90;
        this.Y = 370;
        this.fillRepository(true);
        this.canJumpOn = true;
    }


    initJarProperties() {
        this.height = 45;
        this.width = 50;
        this.Y = 390;            
        this.fillRepository();
    } 
        

    initMiscProperties() {
        this.Y = 400 + Math.random() * 20;
        this.isBackground = Math.random() < 0.5;
        if (this.isBackground) {
            this.height = 40;
            this.width = 40;
            this.Y = this.Y - 40;
        }
    } 
    

    /**
     * hides several items in jar or chest
     * @param {boolean} keyRequired determines if a 'key' MUST be in the list
     */
    fillRepository(keyRequired) {
        let arrFound = ['key','coin','bullet','food','medicine','seed','chilli','drink', null];
        if (keyRequired) delete arrFound [0]; // remove the 'key' when we got a chest!
        let range = 110 - this.level.levelNo * 10,
            chance = random(1, 100),            
            value = random (1, this.level.levelNo * 3),
            index = random (1, arrFound.length);                 
        if (chance <= range && arrFound[index] != null) this.contains = (arrFound[index] + value);
    }
}