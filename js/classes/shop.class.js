import Mobile from './mobile.class.js';
import { CANVAS_WIDTH } from '../const.js';
import { random } from '../library.js';
import { Intervals } from '../game.js';
const CLOSED = 0, OPEN = 1;

export default class Shop extends Mobile {
    name = 'Shop';
    type = 'shop';
    arrImages = [];
    #arrGoods = [];
    level;
    levelNo;
    imagePath;
    isBackground = true;
    isOpen = true;
    get goods() {return this.#arrGoods;}

    constructor(imgPath, level) {         
        super()
        this.level = level;
        this.levelNo = level.levelNo;
        this.imagePath = imgPath;
        this.initialize();
        this.storeGoods();
        this.checkForOpen(this);
    }

    initialize() {
        for (let i = 0; i < 2; i++) {
            this.arrImages.push(this.imagePath.substring(0, this.imagePath.lastIndexOf('/')) + `/shop${i}.png`);
        }
        this.loadImage(this.arrImages[CLOSED]); // must be executed to avoid console error!
        this.height = 270;
        this.width = 220;
        this.Y = 150;
        this.X = random(150, this.level.eastEnd - CANVAS_WIDTH * 0.8);
        this.X = Math.random() < 0.5 ? -this.X : this.X;
        if (this.X < this.level.westEnd) this.X = this.level.westEnd + 2 * this.width;
    };

    storeGoods() {
        for (let i = 1; i <= this.levelNo; i++) {
            this.#arrGoods.push(
                {item: 'medizine',
                 price: parseInt(50 + Math.random() * i * 100)
                },
                {item: 'gun',
                 price: i * 1000
                },
                {item: 'bullet',
                 price: parseInt((5 + Math.random() * 10) * i * 50)
                },
                {item: 'food',
                 price: parseInt((5 + Math.random() * 15) * i * 5)
                },
                {item: 'drink',
                 price: parseInt((5 + Math.random() * 20) * i * 5)
                },
                {item: 'chili',
                 price: parseInt((5 + Math.random() * 15) * i * 5)
                },
                {item: 'bottle',
                 price: i * 500
                }
            );
        }
    }

    checkForOpen($this) {
        Intervals.add(
            function shopImage() {
                let path = $this.isOpen ? $this.arrImages[OPEN] : $this.arrImages[CLOSED];
                $this.loadImage(path);
            }, 500, [$this]
        );
    }
}