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
    $('endbossTime').value = gameSettings.endbossAttackingTime;
    $('secEndboss').innerText = gameSettings.endbossAttackingTime + ' sec';
    $('enlargeChicken').value = gameSettings.chickenEnlargement;
    $('enlargePix').innerText = gameSettings.chickenEnlargement + ' px';
    $('chkSound').checked = gameSettings.soundEnabled;
    $('chkHelp').checked = gameSettings.showHelpOnStart;
    $('chkIntro').checked = gameSettings.showIntro
    $('chkDebugger').checked = gameSettings.debugMode;
    $('debugCoins').value = gameSettings.dbgCoins;
    $('dbgCoins').innerText = gameSettings.dbgCoins;
    $('debugBottles').value = gameSettings.dbgBottles;
    $('dbgBottles').innerText = gameSettings.dbgBottles;
    $('debugBullets').value = gameSettings.dbgBullets;
    $('dbgBullets').innerText = gameSettings.dbgBullets;
    $('debugSeeds').value = gameSettings.dbgSeeds;
    $('dbgSeeds').innerText = gameSettings.dbgSeeds;
    $('chkFrame').checked = gameSettings.showFrame;
    $('chkEnemiesOff').checked = gameSettings.enemiesOff;
    $('chkLogIntervals').checked = gameSettings.logIntervals;
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