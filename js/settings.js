import $ from './library.js';
import { loadSettings, saveSettings, setSettings, gameSettings } from './settings_mod.js';
import { APP_NAME } from './const.js'

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
    console.log(gameSettings);
})

window.onbeforeunload = function() {
    saveSettings(APP_NAME);
}
loadSettings(APP_NAME);
setSettings();
enableControls('divMusic', gameSettings.musicEnabled);
enableControls('divDebugmode', gameSettings.debugMode);

function displayValue(event) {    
    let setting = event.target.dataset.settings,
        value = event.target.value;

    switch (setting) {
        case 'musicvol':
            $('volPercent').innerText = value + '%'; // show music volume 
            break;
        case 'sleep':
            $('secSleep').innerText = value + ' sec';
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