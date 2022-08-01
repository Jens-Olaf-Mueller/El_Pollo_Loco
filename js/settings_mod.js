import $ from './library.js';
import { DEFAULT_SETTINGS, APP_NAME, SONG_TITLES } from './const.js';

// "re-export" of variables or constants: 
// export { DEFAULT_SETTINGS as gameSettings } from './const.js';
export let gameSettings = DEFAULT_SETTINGS;

export function loadSettings(key = APP_NAME, displaySettings = false) { 
    // Alternative:
    // let ls = localStorage.getItem('key') || 'default-settings'; 
    let ls = localStorage.getItem(key);
    if (ls) gameSettings = JSON.parse(ls);
    if (displaySettings) setSettings();
}

/**
 * display property values in form controls:
 */
export function setSettings () {
    $('chkMusic').checked = gameSettings.musicEnabled;
    $('volMusic').value = gameSettings.volume;
    $('volPercent').innerText = gameSettings.volume + '%';
    $('songNo').value = gameSettings.lastSong;
    $('songTitle').innerText = SONG_TITLES[gameSettings.lastSong];
    $('sleepTime').value = gameSettings.sleepTime;
    $('secSleep').innerText = gameSettings.sleepTime + ' sec';
    $('enlargeChicken').value = gameSettings.chickenEnlargement;
    $('enlargePix').innerText = gameSettings.chickenEnlargement + ' px';
    $('chkSound').checked = gameSettings.soundEnabled;
    $('chkHelp').checked = gameSettings.showHelpOnStart;
    $('chkIntro').checked = gameSettings.showIntro
    $('chkDebugger').checked = gameSettings.debugMode;
    $('debugBottles').value = gameSettings.debugBottles;
    $('dbgBottles').innerText = gameSettings.debugBottles;
    $('debugBullets').value = gameSettings.debugBullets;
    $('dbgBullets').innerText = gameSettings.debugBullets;
    $('debugSeeds').value = gameSettings.debugSeeds;
    $('dbgSeeds').innerText = gameSettings.debugSeeds;
    $('chkFrame').checked = gameSettings.showFrame;
}

export function saveSettings (key, pepe) {    
    if (pepe) {
        if(pepe.score > gameSettings.highScore) gameSettings.highScore = pepe.score;
        gameSettings.lastLevel = pepe.environment.levelNo;
        gameSettings.score = pepe.score;
        gameSettings.energy = pepe.energy;
        gameSettings.jumpPower = pepe.jumpPower;
        gameSettings.sharpness = pepe.sharpness;
        gameSettings.accuracy = pepe.accuracy;
        gameSettings.coins = pepe.coins;
        gameSettings.bottles = pepe.bottles;
        gameSettings.bullets = pepe.bullets;
        gameSettings.gun = pepe.gun;
        gameSettings.keyForChest = pepe.keyForChest;
        gameSettings.seeds = pepe.seeds;
    }
    localStorage.setItem(key, JSON.stringify(gameSettings));
}