import $ from './library.js';
import { APP_NAME, SONG_TITLES } from './const.js';
import { loadSettings, saveSettings, gameSettings } from './settings_mod.js';

const arrControls = Array.from($('[data-settings'));
const arrSliders = Array.from($('input[type=range]'));

// Use Array.forEach to add an event listener to each control
arrControls.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        updateSettings(event);
    })
});

arrSliders.forEach(slider => {
    slider.addEventListener('input', (event) => {    
        displayValue(event);
    })      
});

$('btnClearStorage').addEventListener('click', () => {
    window.localStorage.removeItem(APP_NAME);
    restoreSettings();
    location.reload();
})

window.onbeforeunload = function() {
    saveSettings(APP_NAME);
}

loadSettings(APP_NAME, true);
// setSettings();
enableControls('divMusic', gameSettings.musicEnabled);
enableControls('divDebugmode', gameSettings.debugMode);

function displayValue(event) {    
    let setting = event.target.dataset.settings,
        value = event.target.value;

    switch (setting) {
        case 'musicvol':
            $('volPercent').innerText = value + '%'; // show music volume 
            break;
        case 'song':
            $('songTitle').innerText = SONG_TITLES[value];
            break;      
        case 'sleep':
            $('secSleep').innerText = value + ' sec';
            break;
        case 'endboss':
            $('secEndboss').innerText = value + ' sec';
            break;
        case 'enlarge':
            $('enlargePix').innerText = value + ' px';
            break;
        case 'bottles':
            $('dbgBottles').innerText = value;
            break;
        case 'bullets':
            $('dbgBullets').innerText = value;
            break;
        case 'seeds':
            $('dbgSeeds').innerText = value;
            break;
    }
}

function updateSettings (event) {
    let setting = event.target.dataset.settings, value;    
    if (event.target.type == 'checkbox') value = event.target.checked;
    if (event.target.type == 'radio' || event.target.type == 'range') value = event.target.value;

    switch (setting) {
        case 'music':
            gameSettings.musicEnabled = value;
            enableControls ('divMusic', value);
            break;
        case 'musicvol':
            gameSettings.volume = value;
            break;
        case 'song':
            gameSettings.lastSong = value;
            break;
        case 'sound':
            gameSettings.soundEnabled = value;
            break;
        case 'sleep':
            gameSettings.sleepTime = value;
            break;
        case 'endboss':
            gameSettings.endbossAttackingTime = value;
            break;            
        case 'enlarge':
            gameSettings.chickenEnlargement = value;
            break;            
        case 'help':
            gameSettings.showHelpOnStart = value;
            break;
        case 'intro':
            gameSettings.showIntro = value;
            break;
        case 'bottles':
            gameSettings.debugBottles = value;
            break;
        case 'bullets':
            gameSettings.debugBullets = value;
            gameSettings.debugGun = value > 0;
            break;
        case 'seeds':
            gameSettings.debugSeeds = value;
            break;  
        case 'frame':
            gameSettings.showFrame = value;
            break;              
                
        default:
            gameSettings.debugMode = value;
            enableControls('divDebugmode', value);
            break;
    }
}

function enableControls (id, state) {
    const parent = $(id);
    enableSubControls (parent, state);
    // avoiding endless loop!!!
    if (id !== 'divChkDebugger') {
        enableControls('divChkDebugger', true);
    }
}

function enableSubControls (element, state) {
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.tagName == 'DIV') {
            enableSubControls (child, state);
        } else if (state) {
            child.removeAttribute('disabled');
        } else {
            child.setAttribute('disabled','disabled');
        }
    }
}

function restoreSettings () {
    gameSettings.musicEnabled = true;
    gameSettings.volume = 50;
    gameSettings.soundEnabled = true;
    gameSettings.debugMode = false;
      gameSettings.showFrame = false;
      gameSettings.debugBottles = 0;
      gameSettings.debugBullets = 0;
      gameSettings.debugGun = false;
      gameSettings.debugSeeds = 0;
    gameSettings.showIntro = true;
    gameSettings.showHelpOnStart = true;
    gameSettings.lastSong = 0;
    gameSettings.chickenEnlargement = 3;
    gameSettings.sleepTime = 7;
    gameSettings.lastLevel = 1;
    gameSettings.highScore = 0;
    gameSettings.energy = 100;
    gameSettings.score = 0;
    gameSettings.jumpPower = 70;
    gameSettings.sharpness = 40;
    gameSettings.accuracy = 50;
    gameSettings.coins = 0;
    gameSettings.bottles = 0;
    gameSettings.bullets = 0;
    gameSettings.gun = false;
    gameSettings.keyForChest = 0;
    gameSettings.seeds = 0;
}