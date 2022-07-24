// ####################################################################
// ###  import all required functions from outer .js-files          ###
// ###  such as: $          -   "document.getElementsByAnything"    ###
// ###           playSound  -   sound output                        ###
// ###  import all required classes                                 ###
// ####################################################################
import World from './classes/world.class.js';
import Container from './classes/container.class.js';
import $ from "./library.js";
import { loadSettings, saveSettings, gameSettings } from './settings_mod.js';
import { playSound, fadeSound, sleep, random } from "./library.js";
import Keyboard from './classes/keyboard.class.js';
import { APP_NAME, ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, SOUNDS, IMG_GAMEOVER, IMG_START } from './const.js';

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
    gameStarted,
    currentSong;

export let arrIntervals = [];
export let objAudio = {};

const homeScreen = new Container('divHome'),
      introScreen = new Container('divIntro'),
      navBar = new Container('divNavbar'),
      statusBar = new Container('divStatusbar'),
      canvasDiv = new Container('divCanvas'),
      keyboard = new Keyboard();


runApp();

function runApp () {
    setEventListeners();
    loadSettings(APP_NAME);
     // check for the very first start and show help if wanted
    gameStarted = sessionStorage.getItem(APP_NAME + '_IsRunning');
    if (!gameStarted) {
        sessionStorage.setItem(APP_NAME + '_IsRunning', true);
        if (gameSettings.showHelpOnStart) window.location.href = 'help.html';
    }
}

function startGame() {      
    // saveSettings(APP_NAME); 
    loadStatusIcons();   
    loadSounds();
    document.body.style.backgroundImage = 'none';  
    homeScreen.hide();
    canvasDiv.show();
    navBar.show();
    statusBar.show();
    introScreen.removeClass('fade');  
    if (gameSettings.showIntro) showIntroScreen(gameSettings.lastLevel);
    if (gameSettings.musicEnabled) playMusic();
    world = new World(canvas, keyboard);
    if (gameSettings.debugMode) console.log('GAME STARTED...'); 
}

export async function gameOver () {
    stopIntervals();
    saveSettings(APP_NAME, world.Pepe);
    fadeSound (currentSong, false);    
    await sleep(1000);
    playSound(objAudio['gameover'], gameSettings.soundEnabled);
    world = undefined;   
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
        playSound(objAudio['jingle'], gameSettings.soundEnabled);
        $('introH1').innerText = 'Level  ' + level;
        introScreen.element.style.backgroundImage = IMG_START[random(0,1)];       
        introScreen.show();
        await sleep(2000);
        introScreen.addClass('fade');
    }       
}

function playMusic () {
    let key = gameSettings.lastSong.toLowerCase().includes('esmeralda') ? 'song0' : 'song1';
    currentSong = objAudio[key];
    playSound (currentSong, true, gameSettings.volume);
}

/**
 * clears a single interval or all intervals in the main intervals-array
 * @param {number} interval 
 * @returns 
 */
function stopIntervals (interval) {
    if (interval) {
        clearInterval(interval);
        return;
    }
    for (let i = 0; i < arrIntervals.length; i++) {
        const interval = arrIntervals[i];
        clearInterval(interval);
    }
    arrIntervals = [];
    window.cancelAnimationFrame(world.requestID);
    world.requestID = undefined;
}

export function pauseGame () {
    for (let i = 0; i < arrIntervals.length; i++) {
        const interval = arrIntervals[i];
        clearInterval(interval);
    }
    playSound(gameSettings.lastSong, false);
    arrIntervals = [];
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
}

// function removeEventListener (id) {
    // comes later
    // id must be given in 'setEventListeners' function, say as variable
// }

export function updateGameStatus (pepe) {
    // let j = Math.floor(pepe.jumpPower) > 10 ? 10 : Math.floor(pepe.jumpPower);
    ICON_JUMP.src = arrJumpIcons[getImageIndex(pepe.jumpPower)]; 
    ICON_ENERGY.src = arrEnergyIcons[getImageIndex(pepe.energy)];
    ICON_SHARPNESS.src = arrSharpIcons[getImageIndex(pepe.sharpness)];    
    ICON_ACCURACY.src = arrAccuracyIcons[getImageIndex(pepe.accuracy)];

    $('#divCoin >label').innerText = pepe.coins;
    $('#divBottle >label').innerText = pepe.bottles;        
    $('divScore').innerText = 'Score: ' + parseInt(pepe.score);
    $('imgLevel').src = `./img/Status/Level/${world.levelNo}.png`;
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

function loadStatusIcons () {
    arrJumpIcons = [], arrEnergyIcons = [], arrAccuracyIcons = [], arrSharpIcons = [];
    for (let i = 0; i < 11; i++) {
        arrJumpIcons.push(`./img/Status/Jump/jmp${i*10}.png`);
        arrEnergyIcons.push(`./img/Status/Energy/battery${i*10}.png`);
        arrSharpIcons.push(`./img/Status/Sharpness/sharp${i*10}.png`);
        arrAccuracyIcons.push(`./img/Status/Accuracy/accuracy${i*10}.png`);
    }        
}

function loadSounds () {
    // let arrSongs = [];
    for (let i = 0; i < SOUNDS['songs'].length; i++) {
        const song = new Audio ('./sound/' + SOUNDS['songs'][i]);
        // objAudio.songs.push(song); // GEHT NICHT!
        // arrSongs.push(song);
        objAudio[`song${i}`] = song;
    }
    // objAudio.songs.push.apply(arrSongs);

    // now loading the sounds...
    for (const key in SOUNDS) {
        if (SOUNDS.hasOwnProperty(key)) {   
            if (!Array.isArray(SOUNDS[key])) {
                const sound = new Audio('./sound/' + SOUNDS[key]);
                objAudio[key] = sound;
            }             
        }
    } 
//   console.log( objAudio)
//   debugger
}