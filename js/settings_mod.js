import $ from './library.js';

export let gameSettings = {
    musicEnabled: true,
    volume: 50,
    soundEnabled: true,
    debugMode: false,
      debugBottles: 0,
      debugBullets: 0,
      debugGun: false,
      debugSeeds: 0,
    showIntro: true,
    showHelpOnStart: true,
    lastSong: 'Santa Esmeralda.mp3',
    chickenEnlargement: 3,
    sleepTime: 7,
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

export function loadSettings(key) { 
    // Alternative:
    // let ls = localStorage.getItem('key') || 'default-settings'; 
    let ls = localStorage.getItem(key);
    if (ls) gameSettings = JSON.parse(ls);
}

// set values in form controls:
export function setSettings () {
    $('chkMusic').checked = gameSettings.musicEnabled;
    $('volMusic').value = gameSettings.volume;
    $('volPercent').innerText = gameSettings.volume + '%';
    if (gameSettings.lastSong.toLowerCase().includes('esmeralda')) {
        $('optSong1').checked = true;
    } else {
        $('optSong2').checked = true;
    }
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