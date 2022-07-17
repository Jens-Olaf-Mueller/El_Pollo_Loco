import $ from './library.js';
import { loadSettings, saveSettings, setSettings, gameSettings } from './settings_mod.js';
import { APP_NAME } from './const.js'

const arrCheckboxes = Array.from($('[data-settings'));
const volMusic = $('volMusic');
const sldSleep = $('sleepTime');
const sldEnlarge =$('enlargeChicken');

// Use Array.forEach to add an event listener to each checkbox.
arrCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        updateSettings(event);
    })
});

volMusic.oninput = function () {
    $('volPercent').innerText = this.value + '%'; // show music volume 
}

sldSleep.oninput = function () {
    $('secSleep').innerText = this.value + ' seconds';
}

sldEnlarge.oninput = function () {
    $('enlargePix').innerText = this.value + ' px';
}

window.onbeforeunload = function() {
    saveSettings(APP_NAME);
}

loadSettings(APP_NAME);
setSettings();
updateMusicSettings(gameSettings.musicEnabled);

function updateSettings (event) {
    let setting = event.target.dataset.settings, value;    
    if (event.target.type == 'checkbox') value = event.target.checked;
    if (event.target.type == 'radio' || event.target.type == 'range') value = event.target.value;

    switch (setting) {
        case 'music':
            gameSettings.musicEnabled = value;
            updateMusicSettings (value);
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
        default:
            gameSettings.debugMode = value;
            break;
    }
}

function updateMusicSettings (state) {
    let strValue = state.toString();
    $('volMusic').disabled = !state;
    $('optSong1').disabled = !state;
    $('optSong2').disabled = !state;

    if (state) {
        $('lblVolMusic').removeAttribute('disabled');
        $('volPercent').removeAttribute('disabled');
        $('lblSong1').removeAttribute('disabled');
        $('lblSong2').removeAttribute('disabled');
    } else {
        $('lblVolMusic').setAttribute('disabled','disabled');
        $('volPercent').setAttribute('disabled','disabled');
        $('lblSong1').setAttribute('disabled','disabled');
        $('lblSong2').setAttribute('disabled','disabled');
    }
}