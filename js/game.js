/** 
 * import all required functions & classes from outer .js-files
 */
import World from './classes/world.class.js';
import Sound from './classes/sound.class.js';
import IntervalListener from './classes/intervals.class.js';
import $ from "./library.js";
import { loadSettings, saveSettings, gameSettings } from './settings_mod.js';
import { sleep, random } from "./library.js";
import Keyboard from './classes/keyboard.class.js';
import { APP_NAME, SOUNDS,
         ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START,
         homeScreen, introScreen ,canvasDiv, navBar, statusBar
        } from './const.js';
/**
 * D E C L A R A T I O N S
 *  @param {class} world main class that contains all other objects
 *  @param {class} keyboard class to survey the keyboard interactions
 *  @param {element} canvas HTML-Element to draw all objects
 */
let canvas = $('canvas'),
    world,
    arrEnergyIcons, 
    arrJumpIcons, 
    arrAccuracyIcons, 
    arrSharpIcons,
    gameStarted;

export const Intervals = new IntervalListener();
export const Sounds = new Sound('./sound/');
const keyboard = new Keyboard(); 
const fontZabars = new FontFace('Zabars', 'url(./fonts/Zabars/zabars-webfont.woff2)');

runApp();

function runApp () {
    setEventListeners();
    loadSettings(APP_NAME);
    loadFont(fontZabars);
     // check for the very first start and show help if wanted
    gameStarted = sessionStorage.getItem(APP_NAME + '_IsRunning');
    if (!gameStarted) {
        sessionStorage.setItem(APP_NAME + '_IsRunning', true);
        if (gameSettings.showHelpOnStart) window.location.href = 'help.html';
    }
}

function startGame() {      
    saveSettings(APP_NAME); 
    initStatusIcons();   
    initSounds();
    document.body.style.backgroundImage = 'none';  
    homeScreen.hide();
    canvasDiv.show();
    navBar.show();
    statusBar.show();
    introScreen.removeClass('fade');  
    if (gameSettings.showIntro) showIntroScreen(gameSettings.lastLevel);
    if (gameSettings.musicEnabled) Sounds.playList(gameSettings.lastSong, gameSettings.volume);
    world = new World(canvas, keyboard);
    if (gameSettings.debugMode) console.log('GAME STARTED...'); 
}

export async function gameOver () {
    // document.exitFullscreen();
    Sounds.fade(parseInt(gameSettings.lastSong), 0);
    Sounds.stop('walk', true);    
    worldTerminate();
    await sleep(1000);
    Sounds.play('gameover');
    statusBar.hide();
    navBar.hide();
    canvasDiv.hide();        
    await showIntroScreen(false);
    introScreen.hide();    
    homeScreen.show();
    document.body.style.backgroundImage = IMG_START[random(0,1)];
    if (gameSettings.debugMode) console.log('G A M E  O V E R  ! ! !'); 
}

/**
 * displays the intro- or outro screen: number == false shows outro!
 * @param {number} level if numeric, shows the intro screen of the given level, 
 * otherwise the game over-screen
 */
export async function showIntroScreen (level) {
    introScreen.removeClass('fade');
    if (level === false) {
        $('introH1').innerText = '';
        introScreen.element.style.backgroundImage = IMG_GAMEOVER; 
        introScreen.removeClass('fade');
        introScreen.show();        
        await sleep(5000);
    } else {
        if (gameSettings.musicEnabled == false) Sounds.play('jingle');
        $('introH1').innerText = 'Level  ' + level;
        introScreen.element.style.backgroundImage = IMG_START[random(0,1)];       
        introScreen.show();
        await sleep(2000);
        introScreen.addClass('fade');
    }       
}

/**
 * reset the old instance of the world class for restart!
 */
 function worldTerminate () {
    Intervals.remove('Pepe'); // MUST be executed first!
    clearInterval(world.mainID);
    Intervals.clear();
    if (world.levelNo > gameSettings.lastLevel) saveSettings(APP_NAME, world.Pepe);
    window.cancelAnimationFrame(world.reqAnimationFrameID);
    world.reqAnimationFrameID = undefined;
    world = undefined;    
}

function setEventListeners () {
    $('btnStart').addEventListener('click', startGame);
    $('imgEnergy').addEventListener('dblclick', (e) => {
        console.log('Status Pepe: [Score: ' + world.Pepe.score + ']');
        console.log('==============================');
        console.log('Energy: ' + world.Pepe.energy);
        console.log('Jump-Power: ' + world.Pepe.jumpPower);
        console.log('Accuracy: ' + world.Pepe.accuracy);
        console.log('Sharpness: ' + world.Pepe.sharpness);
    });
    
    window.addEventListener('resize', () => {
        canvas.width = canvasDiv.element.clientWidth;
        canvas.height = canvasDiv.element.clientHeight;
    });
}

/**
 * installs a font to the current document
 * @param {object} newFont font-object to be installed
 */
function loadFont (newFont) {
    newFont.load().then(function(font){
        // with canvas, if this is ommited won't work
        document.fonts.add(font);
        if(gameSettings.debugMode) console.log('Font "' + font.family + '" loaded...'); 
    });
}

export function updateGameStatus (pepe) {
    ICON_JUMP.src = arrJumpIcons[getImageIndex(pepe.jumpPower)]; 
    ICON_ENERGY.src = arrEnergyIcons[getImageIndex(pepe.energy)];
    ICON_SHARPNESS.src = arrSharpIcons[getImageIndex(pepe.sharpness)];    
    ICON_ACCURACY.src = arrAccuracyIcons[getImageIndex(pepe.accuracy)];

    $('#divCoin >label').innerText = pepe.coins;
    $('#divBottle >label').innerText = pepe.bottles;        
    $('divScore').innerText = 'Score: ' + parseInt(pepe.score);
    $('divLevel').innerText = pepe.environment.levelNo;
    $('divBullet').classList.toggle('hidden',(!pepe.bullets && !pepe.gun));
    $('#divBullet >label').innerText = pepe.bullets;
    $('imgKey').classList.toggle('hidden', !pepe.keyForChest);    
    $('divSeed').classList.toggle('hidden',(!pepe.seeds));
    $('#divSeed >label').innerText = pepe.seeds;
    if (pepe.gun) {
        $('imgGun').classList.toggle('hidden', false);
        $('imgBullet').classList.toggle('hidden', true);
    } else if (pepe.bullets) {
        $('imgGun').classList.toggle('hidden', true);
        $('imgBullet').classList.toggle('hidden', false);
    }
}

function getImageIndex (property) {
    return Math.floor(property / 10) > 10 ? 10 : Math.floor(property / 10);
}

function initStatusIcons () {
    arrJumpIcons = [], arrEnergyIcons = [], arrAccuracyIcons = [], arrSharpIcons = [];
    for (let i = 0; i < 11; i++) {
        arrJumpIcons.push(`./img/Status/Jump/jmp${i*10}.png`);
        arrEnergyIcons.push(`./img/Status/Energy/battery${i*10}.png`);
        arrSharpIcons.push(`./img/Status/Sharpness/sharp${i*10}.png`);
        arrAccuracyIcons.push(`./img/Status/Accuracy/accuracy${i*10}.png`);
    }        
}

/**
 * loads all sounds and songs in the responsible class
 */
function initSounds () {
    Sounds.clear();
    for (const key in SOUNDS) {
        if (SOUNDS.hasOwnProperty(key)) {   
            if (!Array.isArray(SOUNDS[key])) {
                Sounds.add(SOUNDS[key], key, !gameSettings.soundEnabled);
            } else {
                let arrSongs = [];
                for (let i = 0; i < SOUNDS[key].length; i++) {
                    arrSongs.push(SOUNDS[key][i]);
                }
                Sounds.add(arrSongs, key, !gameSettings.soundEnabled);
            }            
        }
    } 
    if (gameSettings.debugMode) console.log('Class Sounds:', Sounds);
}