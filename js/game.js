// ####################################################################
// ###  import all required functions from outer .js-files          ###
// ###  such as: $          -   "document.getElementsByAnything"    ###
// ###           playSound  -   sound output                        ###
// ###  import all required classes                                 ###
// ####################################################################
import $ from "./library.js";
import { playSound, random } from "./library.js";

import World from './classes/world.class.js';
import Keyboard from './classes/keyboard.class.js';

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

const energyIcon = $('imgEnergy'),
    jumpIcon = $('imgJump'),
    accuracyIcon = $('imgAccuracy'),
    sharpnessIcon = $('imgSharpness'),
    coinIcon = $('divCoin'),
    bottleIcon = $('divBottle');

const storageKey = 'Settings_El_Pollo_Loco';

export let gameSettings = {
    musicEnabled: false,
    soundEnabled: false,
    debugMode: false,
    showIntro: true,
    showHelpOnStart: true,
    lastLevel: 3,
    lastSong: 'Santa Esmeralda.mp3'
}

setEventListeners();
loadSettings();

function startGame() { 
    loadSounds();      
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

    // for (let i = 1; i < 101; i++) {
    //     console.log('Zahl ' + i + ': ' + random(0,100))      
    // }

}

function setEventListeners () {
    $('btnStart').addEventListener('click', startGame);
    let arrCheckboxes = Array.from($('[data-settings'));   

    // Use Array.forEach to add an event listener to each checkbox.
    arrCheckboxes.forEach(checkbox => {
        // checkbox.addEventListener('change', updateSettings(this));
        checkbox.addEventListener('change', (event) => {
            updateSettings(event);
        })
    });

    $('imgEnergy').addEventListener('dblclick', (e) => {
        console.log('Status Pepe: ', 'Energy: ' + world.Pepe.energy);
        console.log('Jump-Power: ' + world.Pepe.jumpPower);
        console.log('Accuracy: ' + world.Pepe.accuracy);
        console.log('Sharpness: ' + world.Pepe.sharpness);
    });
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
        default:
            gameSettings.debugMode = value;
            break;
    }
    // console.log(gameSettings);
}

function removeEventListener (id) {
    // comes later
    // id must be given in 'setEventListeners' function, say as variable
}

function updateProgressBar (id, value) {  
    let progressbar = $(id);
    if (value == 0) {
        progressbar.style.width = '0px';
        return;
    }
    
    let prgBar = $('divProgress'); 
    let w = prgBar.clientWidth / 100; 
    let percent = value * w;
    progressbar.style.width = percent + 'px';
}

export function updateStatus (pepe) {
    // console.log(`Pepe[Energy:${pepe.energy} | Accuracy:${pepe.accuracy} | Jump:${pepe.jumpPower} | Sharpness:${pepe.sharpness}]`)
    let e = Math.floor(pepe.energy / 10) > 10 ? 10 : Math.floor(pepe.energy / 10),
        s = Math.floor(pepe.sharpness / 10) > 10 ? 10 : Math.floor(pepe.sharpness / 10),
        j = Math.floor(pepe.jumpPower) > 10 ? 10 : Math.floor(pepe.jumpPower),
        a = Math.floor(pepe.accuracy / 10) > 10 ? 10 : Math.floor(pepe.accuracy / 10);
    energyIcon.src = arrEnergyIcons[e];
    sharpnessIcon.src = arrSharpIcons[s];
    jumpIcon.src = arrJumpIcons[j]; 
    accuracyIcon.src = arrAccuracyIcons[a];

    if (pepe.coins) {
        coinIcon.classList.toggle('hidden', (pepe.coins <= 0));
        $('#divCoin >label').innerText = pepe.coins;
    }     
    if (pepe.bottles) {
        bottleIcon.classList.toggle('hidden', (pepe.bottles <= 0));
        $('#divBottle >label').innerText = pepe.bottles;
    }

    $('imgLevel').src = `./img/Status/Level/${world.levelNo}.png`;
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

function loadSettings() {   
    // Super schnelle Alternative:
    // let fromStorage = localStorage.getItem('key') || 'default-settings'; 
    let ls = localStorage.getItem(storageKey);
    if (ls) gameSettings = JSON.parse(ls);

    let arrCheckboxes = Array.from($('[data-settings'));  
    // debugger


    // und Werte im Formular setzen:
    // displaySettings ();
}