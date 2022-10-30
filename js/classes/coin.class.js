import Item from './items.class.js';
import { FPS, CANVAS_WIDTH} from '../const.js';
import { Sounds, Intervals } from '../game.js';
import { random, loadArray,  getPath } from "../library.js";

export default class Coin extends Item {
    name = '';
    type = 'coin';
    coinType = '';    
    height = 30;
    width = 30;
    visible = true;
    value = null;
    index = 0;
    speedY = 1;


    /**
     * returns how many images need to be loaded for animation!
     */
    get imgCount() {
        switch (this.coinType) {
            case 'dollar': return 7;
            case 'gold': return 9;
            case 'bag': return 12;
            case 'clover': return 22;
            case 'topas': return 8;
            case 'diamond': return 6;
            // case 'bill': return 1;
        }
    }

    get coinValue() {
        switch (this.coinType) {
            case 'bill': return 1;
            case 'dollar': return 2;
            case 'clover': return 5;
            case 'bag': return 10; 
            case 'gold': return 40;                       
            case 'topas': return 75;
            case 'diamond': return 100;
        }
    }

    constructor(imgPath, name, level) {  
        super(imgPath, name, level).loadImage(imgPath);
        this.name = name.charAt(0).toUpperCase() + name.slice(1); // first letter uppercase!
        this.coinType = name.replace(/[0-9]/g, '').toLowerCase();  
        this.index = (parseInt(name.replace(/[^0-9]/g,'')) || 0) + 1;
        this.value = this.index * this.coinValue;
        this.arrAnimation = loadArray(`${getPath(imgPath)}${this.coinType}`, this.imgCount);        
        this.loadImageCache(this.arrAnimation, this.name);   
        this.X = random (150, this.eastEnd - CANVAS_WIDTH * 0.8);
        this.X = this.fivty50 ? -this.X : this.X;
        this.Y = 270 - (this.coinValue + this.index * 5) * 2.25;
        if (this.Y < 0) this.Y = 5;
        this.home.X = this.X;
        this.home.Y = this.Y;
        this.animate(this);
    }




    animate($this) {
        Intervals.add(
            function animation() {
                $this.playAnimation($this.arrAnimation, $this.coinType)
            }, 9000 / FPS, $this
        );
        
        Intervals.add(
            function moveUp() {
                $this.Y += $this.speedY;
                if ($this.Y > $this.home.Y + 1 || $this.Y < $this.home.Y - 5) $this.speedY = -$this.speedY;
            }, 80, $this
        )
    }
}