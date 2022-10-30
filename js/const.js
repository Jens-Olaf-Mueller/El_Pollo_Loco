import Container from './classes/container.class.js';
import $ from "./library.js";

const APP_NAME = 'El Pollo Loco';
const PEPE = 'Pepe';
const IMG_GAMEOVER ="url('../img/Intro_Outro/gameover_screen/3.Game over.png')";
const IMG_START = ["url('../img/Intro_Outro/desert0.png')",
                   "url('../img/Intro_Outro/desert1.png')",
                   "url('../img/Intro_Outro/desert2.png')",
                   "url('../img/Intro_Outro/desert3.png')",
                   "url('../img/Intro_Outro/desert4.png')"];
const BTN_PATH = './img/Status/Mobile/';                 


// Frames per second                   
const FPS = 60, GROUND = 150;

// Canvas-Size
const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;
// const CANVAS_HEIGHT = document.getElementById('canvas').getBoundingClientRect().height;
// const CANVAS_WIDTH = document.getElementById('canvas').getBoundingClientRect().width;

// collision constants clockwise (or binary: 1, 2, 4, 8... ?)
const COLLISION = {top: 12, right: 3, bottom: 6, left: 9}

// icons for tatusbar
const ICON_ENERGY = $('imgEnergy'),
      ICON_JUMP = $('imgJump'),
      ICON_ACCURACY = $('imgAccuracy'),
      ICON_SHARPNESS = $('imgSharpness');

const canvasParent = $('divCanvas'),
      homeScreen = new Container('divHome'),
      introScreen = new Container('divIntro'),
      mainScreen = new Container('divCanvas'),
      navBar = new Container('divNavbar'),
      statusBar = new Container('divStatusbar'),
      sideBar = new Container('divSidebar'),
      posBar = new Container('divOrientationbar'),
      shopScreen = new Container('divShop'),
      btnStart = $('btnStart'),
      btnClose = new Container('divClose'),
      btnDemo = $('btnDemo'),
      btnMusic = new Container('imgMusic'),
      btnSound = new Container('imgSound'),
      btnPause = new Container('imgPause'),
      btnFeed = new Container('imgHeart'),
      btnShop = new Container('imgBuy');

const SONG_TITLES = ['Santa Esmeralda','Chicken Song','The Lonely Shepherd'];

const SOUNDS = {
    songs: ['Santa Esmeralda.mp3','Chicken Song.mp3','The Lonely Shepherd.mp3'],
    echo: "echo el_pollo_loco.mp3",
    jingle: "jingle.mp3",
    chord: "chord.mp3",
    ouch: "ouch.mp3",
    suicide: "Pepe dies.mp3",
    plopp: "plopp.mp3",
    found: "item found.mp3",
    coin: "coin click.mp3",
    money: "no money.mp3",
    kaching: "ka ching.mp3",
    shop: "shop door.mp3",
    bees: "flying bees.mp3",
    gameover: "game over.mp3",    
    splat: "splat.mp3",
    bottle: "bottle collected.mp3",
    glass: "glass.mp3",
    chicken: "chicken alert.mp3",
    chicklet: "chicklet chirp.mp3",
    endboss: "endboss hurt.mp3",
    snake: "rattle snake.mp3",
    walk: "walk.mp3",
    seed: "seeds.mp3",
    jump: "jump.mp3",
    gun: "pump gun.mp3",
    shot: "shot gun.mp3",
    ricochet: "ricochet.mp3"
};

export const DEFAULT_SETTINGS = {
    musicEnabled: true,
    volume: 50,
    soundEnabled: true,
    debugMode: false,
      showFrame: false,
      enemiesOff: false,
      logIntervals: false,
      dbgCoins: 0,
      dbgBottles: 0,
      dbgBullets: 0,
      dbgGun: false,
      dbgSeeds: 0,
    showIntro: true,
    showHelpOnStart: true,
    lastSong: 0,
    chickenEnlargement: 3,
    sleepTime: 7,
    endbossAttackingTime: 3,
    lastLevel: 1,
    highScore: 0,
    energy: 100,
    score: 0,
    jumpPower: 70,
    sharpness: 40,
    accuracy: 50,
    coins: 0,
    bottles: 0,
    bullets: 0,
    gun: false,
    keyForChest: 0,
    seeds: 0
}

export { APP_NAME, PEPE, 
        SOUNDS, SONG_TITLES,
        FPS, GROUND,
        CANVAS_HEIGHT, CANVAS_WIDTH,  
        ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS,          
        IMG_GAMEOVER, 
        IMG_START,
        BTN_PATH,
        COLLISION};
export { canvasParent, homeScreen, introScreen, mainScreen, shopScreen,
         navBar, statusBar, sideBar, posBar,
         btnStart, btnClose, btnDemo, btnMusic, btnSound, btnPause, btnFeed, btnShop };