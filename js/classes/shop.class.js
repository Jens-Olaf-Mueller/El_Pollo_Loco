import Mobile from './mobile.class.js';
import { CANVAS_WIDTH } from '../const.js';
import $, { random, loadArray } from '../library.js';
import { Intervals, Sounds } from '../game.js';

import { APP_NAME, SOUNDS,
    ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START, BTN_PATH,
    homeScreen, introScreen, mainScreen, shopScreen, navBar, statusBar, sideBar, posBar, 
    btnDemo, btnStart, btnClose, btnMusic, btnSound, btnPause, btnFeed, btnShop, canvasParent
   } from '../const.js';

const CLOSED = 0, OPEN = 1;

export default class Shop extends Mobile {
    name = 'Shop';
    type = 'shop';
    htmlShop = $('divShop'); // assign the HTML-element for display!
    arrImages = [];
    #arrGoods = [];
    #arrFoodImages = [];
    #arrChiliImages = [];
    #arrDrinksImages = [];
    #arrMedicineImages = [];    
    level;
    environment;
    levelNo;
    imagePath;
    isBackground = true;
    isOpen = false;
    inside = false;
    get goods() {return this.#arrGoods;}
    get cent() {return parseInt(Math.random() * 100) / 100;}

    constructor(imgPath, level) {         
        super()
        this.imagePath = imgPath;
        this.level = level;
        this.levelNo = level.levelNo;
        this.environment = level.environment;        
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
        this.#arrFoodImages.push(...loadArray('./img/Food/food', 25));
        this.#arrChiliImages.push(...loadArray('./img/Food/Chili/chili', 18));
        this.#arrDrinksImages.push(...loadArray('./img/Food/Drinks/drink', 11));
        this.#arrMedicineImages.push(...loadArray('./img/Food/Medicine/medicine', 6));
    };


    /**
     * this loads the store with random goods and prices
     */
    storeGoods() {
        this.#arrGoods = [];        
        for (let i = 1; i <= this.levelNo; i++) {
            this.#arrGoods.push(
                {item: 'chili',
                 price: parseInt((5 + Math.random() * 15) * i * 5) + this.cent,
                 image: this.getRandomImage(this.#arrChiliImages),
                 sold: false
                },
                {item: 'food',
                 price: parseInt((5 + Math.random() * 15) * i * 5) + this.cent,
                 image: this.getRandomImage(this.#arrFoodImages),
                 sold: false
                },
                {item: 'bullet',
                 price: parseInt((5 + Math.random() * 10) * i * 50),
                 image: './img/Items/Guns/bullet0.png',
                 sold: false
                },                
                {item: 'medizine',
                 price: parseInt(50 + Math.random() * i * 100) + this.cent,
                 image: this.getRandomImage(this.#arrMedicineImages),
                 sold: false
                },
                {item: 'seed',
                 price: parseInt(100 + Math.random() * i * 100) + this.cent,
                 image: './img/Items/Seeds/seedbag1.png',
                 sold: false
                },
                {item: 'gun',
                 price: i * 1000,
                 image: './img/Items/Guns/gun1.png',
                 sold: false
                },
                {item: 'drink',
                 price: parseInt((5 + Math.random() * 20) * i * 5) + this.cent,
                 image: this.getRandomImage(this.#arrDrinksImages),
                 sold: false
                },
                {item: 'bottle',
                 price: i * 500,
                 image: './img/Items/Bottles/bottle_icon_edge.png',
                 sold: false
                }
            );
        }
        console.log('Im Shop: ', this.#arrGoods )
    }


    getRandomImage(arr) {
        return arr[random(0, arr.length)];
    }


    renderGoods() {
        this.htmlShop.innerHTML = '';
        for (let i = 1; i < 9; i++) {
            const good = this.#arrGoods[i-1];
            this.htmlShop.innerHTML += `
                <div class="goods" tabindex="${i}" data-goodname="${good.item}">
                    <img src="${good.image}">
                    <p>$ ${good.price}</p>
                </div>
            `;
        }
        this.setEventListeners(this);
    }

    setEventListeners($this) {
        const goods = Array.from($('.goods'));
        goods.forEach(good => {
            good.addEventListener('click', function() {
                $this.buyItem(good);
            });
        });
    }

    buyItem(good) {   
        // good equals the div-element!
        let item = good.dataset.goodname,
            price = Math.round(good.innerText.slice(2)),
            amount = good.firstElementChild.outerHTML.replace(/[^0-9]/g,'');
        this.environment.Pepe.buyGood(item + amount, price);
        
    }


    /**
     * checks if the store is open and displays the correspondending label outside
     * the store is open, if at least ONE item can be bought by the character
     * @param {*} $this current instance
     */
    checkForOpen($this) {
        Intervals.add(
            function shopOpened() {
                $this.isOpen = false;
                $this.#arrGoods.forEach(good => {
                    if ($this.environment.Pepe.hasEnoughMoney(good.price)) {
                        $this.isOpen = true;
                        return;
                    }
                });
                let path = $this.isOpen ? $this.arrImages[OPEN] : $this.arrImages[CLOSED];
                $this.loadImage(path);
            }, 750, $this
        );
    }

    enter() {   
        Sounds.play('shop');  
        this.inside = true;
        this.htmlShop.setAttribute('class', 'shop fade');
        $('canvas').classList.add('hidden');
        posBar.hide();
        navBar.hide();
        sideBar.hide();
        statusBar.addClass('inside-shop');
        btnClose.element.dataset.tooltip = 'Quit shop';
        this.htmlShop.classList.remove('fade');
        this.renderGoods();
    }

    exit() {
        Sounds.play('shop');
        this.inside = false;
        this.htmlShop.classList.add('hidden');        
        posBar.show();
        navBar.show();
        sideBar.show();
        $('canvas').classList.remove('hidden');
        btnClose.element.dataset.tooltip = 'Quit game';
        this.environment.pauseGame(false);
    }
}