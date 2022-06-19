// ####################################################################
// ###  import all required functions from outer .js-files          ###
// ###  such as: $          -   "document.getElementsByAnything"    ###
// ###           playSound  -   sound output                        ###
// ###  import all required classes                                 ###
// ####################################################################
import World from './classes/world.class.js';
import $ from "./library.js";
import { playSound, random } from "./library.js";
import Keyboard from './classes/keyboard.class.js';
import { APP_NAME, ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS } from './const.js';

/**
 * D E C L A R A T I O N S
 *  @param {class} world main class that contains all other objects
 *  @param {class} keyboard class to survey the keyboard interactions
 *  @param {element} canvas HTML-Element to draw all objects
 */
let world,
    keyboard = new Keyboard(),
    settings = $('divSettings'),
    statusbar = $('divStatusbar'),
    canvas = $('canvas'),
    songs = ['Chicken Song.mp3','Santa Esmeralda.mp3']; 
let arrEnergyIcons, arrJumpIcons, arrAccuracyIcons, arrSharpIcons, arrAudio;

export let gameSettings = {
    musicEnabled: false,
    soundEnabled: false,
    debugMode: false,
    showIntro: true,
    showHelpOnStart: true,
    lastSong: 'Santa Esmeralda.mp3',
    lastLevel: 3,
    highScore: 0
}

setEventListeners();
loadSettings();

function startGame() { 
    loadSounds(); 
    saveSettings();     
    settings.classList.add('hidden');
    $('divCanvas').classList.remove('hidden');
    $('divNavbar').classList.remove('hidden');
    statusbar.classList.remove('hidden');
    document.body.style.backgroundImage = 'none'; 
    initGame();
    console.log('GAME STARTED!');
}

function initGame () {
    world = new World(canvas, keyboard);
    playSound(songs[Math.floor(Math.random() * (songs.length))], gameSettings.musicEnabled);
    loadStatusIcons();
}

function setEventListeners () {
    $('btnStart').addEventListener('click', startGame);
    let arrCheckboxes = Array.from($('[data-settings'));
    // Use Array.forEach to add an event listener to each checkbox.
    arrCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            updateSettings(event);
        })
    });

    $('imgEnergy').addEventListener('dblclick', (e) => {
        console.log('Status Pepe: [Score: ' + world.Pepe.score + ']');
        console.log('==============================');
        console.log('Energy: ' + world.Pepe.energy);
        console.log('Jump-Power: ' + world.Pepe.jumpPower);
        console.log('Accuracy: ' + world.Pepe.accuracy);
        console.log('Sharpness: ' + world.Pepe.sharpness);
    });
}

function removeEventListener (id) {
    // comes later
    // id must be given in 'setEventListeners' function, say as variable
}

export function updateGameStatus (pepe) {
    // let j = Math.floor(pepe.jumpPower) > 10 ? 10 : Math.floor(pepe.jumpPower);
    ICON_JUMP.src = arrJumpIcons[getImageIndex(pepe.jumpPower)]; 
    ICON_ENERGY.src = arrEnergyIcons[getImageIndex(pepe.energy)];
    ICON_SHARPNESS.src = arrSharpIcons[getImageIndex(pepe.sharpness)];
    
    ICON_ACCURACY.src = arrAccuracyIcons[getImageIndex(pepe.accuracy)];

    $('#divCoin >label').innerText = pepe.coins;
    $('#divBottle >label').innerText = pepe.bottles;    
    $('divScore').innerText = 'Score: ' + pepe.score;
    $('imgLevel').src = `./img/Status/Level/${world.levelNo}.png`;
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
    arrAudio = [];
    for (let i = 0; i < songs.length; i++) {
        const audio = new Audio('./sound/' + songs[i]), objAudio = {};
        objAudio[`song${i}`] = audio;
        arrAudio.push(objAudio);        
    }

    // console.log(arrAudio);
    // now loading the sounds...
}

function updateSettings (event) {
    let setting = event.target.dataset.settings,
    value = event.target.checked;

    switch (setting) {
        case 'music':
            gameSettings.musicEnabled = value;
            break;
        case 'sound':
            gameSettings.soundEnabled = value;
            break;
        case 'help':
            gameSettings.showHelpOnStart = value;
            break;
        case 'intro':
            gameSettings.showIntro = value;
            break;
        default:
            gameSettings.debugMode = value;
            break;
    }
}

function loadSettings() {   
    // Alternative:
    // let fromStorage = localStorage.getItem('key') || 'default-settings'; 
    let ls = localStorage.getItem(APP_NAME);
    if (ls) gameSettings = JSON.parse(ls);
    // und Werte im Formular setzen:
    $('chkMusic').checked = gameSettings.musicEnabled;
    $('chkSound').checked = gameSettings.soundEnabled;
    $('chkHelp').checked = gameSettings.showHelpOnStart;
    $('chkIntro').checked = gameSettings.showIntro
    $('chkDebugger').checked = gameSettings.debugMode;
}

function saveSettings () {    
    // if(world.Pepe.score > gameSettings.highScore) gameSettings.highScore = world.Pepe.score;
    localStorage.setItem(APP_NAME, JSON.stringify(gameSettings));
}