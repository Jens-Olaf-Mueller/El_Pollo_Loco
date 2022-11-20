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
     * returns the value of each coin type
     * and how many images need to be loaded for animation!
     */
    get coin() {
        switch (this.coinType) {
            case 'bill':    return {value: 1, images: 0};
            case 'dollar':  return {value: 2, images: 7};
            case 'clover':  return {value: 5, images: 22};
            case 'bag':     return {value: 10, images: 12}; 
            case 'gold':    return {value: 40, images: 9};                       
            case 'topas':   return {value: 75, images: 8};
            case 'diamond': return {value: 100, images: 6};
        }
    }

    constructor(imgPath, name, level, id = '') {  
        super(imgPath, name, level).loadImage(imgPath); 
        this.coinType = name.replace(/[0-9]/g, '').toLowerCase();       
        this.name = name.charAt(0).toUpperCase() + this.coinType.slice(1) + id; // first letter uppercase!
        this.index = id + 1;
        this.value = this.index * this.coin.value;
        this.arrAnimation = loadArray(`${getPath(imgPath)}${this.coinType}`, this.coin.images);        
        this.loadImageCache(this.arrAnimation, this.name); 
        this.placePosition();
        this.animate(this);
    }

    placePosition() {
        this.X = random (150, this.eastEnd - 75);
        this.X = this.fivty50 ? -this.X : this.X;
        this.Y = 270 - (this.coin.value + this.index * 5) * 2.25;
        if (this.Y <= 0) this.Y = 10;
        this.home.X = this.X;
        this.home.Y = this.Y;        
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