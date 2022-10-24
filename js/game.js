/** 
 * import all required functions & classes from outer .js-files
 */
import World from './classes/world.class.js';
import Sound from './classes/sound.class.js';
import IntervalListener from './classes/intervals.class.js';
import $ from "./library.js";
import { loadSettings, saveSettings, gameSettings } from './settings_mod.js';
import { sleep, random } from "./library.js";
import { APP_NAME, SOUNDS,
         ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START, BTN_PATH,
         homeScreen, introScreen ,mainScreen, navBar, statusBar, sideBar, posBar, 
         btnDemo, btnStart, btnClose, btnMusic, btnSound, btnPause, btnFeed, btnShop
        } from './const.js';
/**
 * D E C L A R A T I O N S
 *  @param {class} world main class that contains all other objects
 *  @param {element} canvas HTML-Element to draw all objects
 */
const canvas = $('canvas'),
      video = $('movie'),
      fontZabars = new FontFace('Zabars', 'url(./fonts/Zabars/zabars-webfont.woff2)');
export const Intervals = new IntervalListener();
export const Sounds = new Sound('./sound/');

let world,
    arrEnergyIcons, 
    arrJumpIcons, 
    arrAccuracyIcons, 
    arrSharpIcons,
    gameStarted;
export let demoMode;

runApp();

function runApp() {
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
    demoMode = false;
    saveSettings(APP_NAME); 
    initStatusIcons();   
    initSounds();
    document.body.style.backgroundImage = '../img/Intro_Outro/desert2_1920x1080.jpg';  
    homeScreen.hide();
    mainScreen.show();
    navBar.show();
    sideBar.show();
    statusBar.show();
    introScreen.removeClass('fade');  
    if (gameSettings.showIntro) showIntroScreen(gameSettings.lastLevel);
    if (gameSettings.musicEnabled) Sounds.playList(gameSettings.lastSong, gameSettings.volume);
    world = new World(canvas);
    if (gameSettings.debugMode) {
        console.log('GAME STARTED...');
        ICON_ENERGY.addEventListener('dblclick', logCharacterState);
    } 
}

export async function gameOver() {
    // document.exitFullscreen();
    Sounds.fade(parseInt(gameSettings.lastSong), 0);
    Sounds.stop('walk', true);    
    worldTerminate();
    await sleep(1000);
    Sounds.play('gameover');
    statusBar.hide();
    navBar.hide();            
    await hideIntroScreen();
    mainScreen.hide();
    introScreen.hide();    
    homeScreen.show();
    document.body.style.backgroundImage = IMG_START[random(0,IMG_START.length-1)];
    if (gameSettings.debugMode) console.log('G A M E  O V E R  ! ! !'); 
}

/**
 * displays the intro- or outro screen: number == false shows outro!
 * @param {number} level if numeric, shows the intro screen of the given level, 
 * otherwise the game over-screen
 */
export async function showIntroScreen(level) {
    introScreen.removeClass('fade');
    if (gameSettings.soundEnabled && !gameSettings.musicEnabled) Sounds.play('jingle');
    $('introH1').innerText = 'Level  ' + level;
    canvas.classList.remove('hidden');
    posBar.show();
    introScreen.element.style.backgroundImage = IMG_START[random(0,IMG_START.length-1)];       
    introScreen.show();
    await sleep(2500);
    introScreen.addClass('fade'); 
}

export async function hideIntroScreen() {
    introScreen.removeClass('fade');
    $('introH1').innerText = '';
    canvas.classList.add('hidden');
    posBar.hide();
    introScreen.element.style.backgroundImage = IMG_GAMEOVER;
    introScreen.show();        
    await sleep(5000);
}

/**
 * reset the old instance of the world class for restart!
 */
 function worldTerminate() {
    Intervals.remove('Pepe'); // MUST be executed first!
    clearInterval(world.mainID);
    Intervals.clear();
    if (world.levelNo > gameSettings.lastLevel) saveSettings(APP_NAME, world.Pepe);
    window.cancelAnimationFrame(world.reqAnimationFrameID);
    world.reqAnimationFrameID = undefined;
    world = undefined;    
}

function setEventListeners() {
    btnStart.addEventListener('click', startGame);       
    btnDemo.addEventListener('click', playDemo);
    canvas.addEventListener('click', closeDemo);
    btnClose.addEventListener('click', closeDemo); 
    btnMusic.setEventListener('click', function() {
        gameSettings.musicEnabled = !gameSettings.musicEnabled;
        if (gameSettings.musicEnabled) {
            Sounds.playList(gameSettings.lastSong, gameSettings.volume);
        } else {
            Sounds.stop(parseInt(gameSettings.lastSong));
        }
    })
    // http://jsfiddle.net/on1kh4o0/
    video.addEventListener('play', function() {
        const $this = this; //cache
        let ctx = canvas.getContext('2d');
        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / 30); // drawing at 30fps
            } else if ($this.ended) {
                $this.load();
                $this.play();
            }
        })();
    }, false);

    btnSound.setEventListener('click', function() {
        gameSettings.soundEnabled = !gameSettings.soundEnabled;
        initSounds();
    })

    // window.addEventListener('resize', () => {
    //     canvas.width = mainScreen.element.clientWidth;
    //     canvas.height = mainScreen.element.clientHeight;
    // });
}

/**
 * https://stackoverflow.com/questions/4429440/html5-display-video-inside-canvas
 */
function playDemo() {
    demoMode = true;
    homeScreen.hide();
    statusBar.hide();
    sideBar.hide();
    posBar.hide();
    canvas.classList.remove('hidden');
    mainScreen.show();

    video.muted = true;
    video.play();
}

function closeDemo() {
    if (demoMode) {
        demoMode = false;
        mainScreen.hide();
        canvas.classList.add('hidden');
        video.pause();
        video.currentTime = 0;
        homeScreen.show();
    }
}

function logCharacterState() {
    console.log('==============================');
    console.log('Status Pepe:');
    console.log('==============================');
    console.log('Score: ' + world.Pepe.score);
    console.log('Energy: ' + world.Pepe.energy);
    console.log('Jump-Power: ' + world.Pepe.jumpPower);
    console.log('Accuracy: ' + world.Pepe.accuracy);
    console.log('Sharpness: ' + world.Pepe.sharpness);
    console.log('Bottles: ' + world.Pepe.bottles);
}

/**
 * installs a font to the current document
 * @param {object} newFont font-object to be installed
 */
function loadFont(newFont) {
    newFont.load().then(function(font){
        document.fonts.add(font);
        if (gameSettings.debugMode) console.log('Font "' + font.family + '" loaded...'); 
    });
}

export function updateGameStatus(pepe) {
    ICON_JUMP.src = arrJumpIcons[getImageIndex(pepe.jumpPower)]; 
    ICON_ENERGY.src = arrEnergyIcons[getImageIndex(pepe.energy)];
    ICON_SHARPNESS.src = arrSharpIcons[getImageIndex(pepe.sharpness)];    
    ICON_ACCURACY.src = arrAccuracyIcons[getImageIndex(pepe.accuracy)];
    let state = gameSettings.musicEnabled && !world.gamePaused;
    btnMusic.element.src = state ? BTN_PATH + 'music on.png' : BTN_PATH + 'music off.png';
    state = gameSettings.soundEnabled && !world.gamePaused;
    btnSound.element.src = state ? BTN_PATH + 'sound on.png' : BTN_PATH + 'sound off.png';
    btnPause.element.src = world.gamePaused ? BTN_PATH + 'play.png' :  BTN_PATH + 'pause.png';

    $('#divCoin >label').innerText = pepe.coins;
    $('#divBottle >label').innerText = pepe.bottles;        
    $('divScore').innerText = 'Score: ' + parseInt(pepe.score);
    $('divLevel').innerText = world.levelNo;
    $('divBullet').classList.toggle('hidden',(!pepe.bullets && !pepe.gun));
    $('#divBullet >label').innerText = pepe.bullets;
    $('imgKey').classList.toggle('hidden', !pepe.keyForChest);    
    $('divSeed').classList.toggle('hidden',(!pepe.seeds));
    $('#divSeed >label').innerText = pepe.seeds;
    btnFeed.toggleClass('hidden', (!pepe.seeds));
    btnShop.toggleClass('hidden', (!pepe.isInFrontOfShop));
    
    if (pepe.gun) {
        $('imgGun').classList.toggle('hidden', false);
        $('imgBullet').classList.toggle('hidden', true);
    } else if (pepe.bullets) {
        $('imgGun').classList.toggle('hidden', true);
        $('imgBullet').classList.toggle('hidden', false);
    }
    $('divCursor').style.width = calcPosition(pepe) + '%';
}

function calcPosition(pepe) {
    let percent = parseInt((Math.abs(pepe.X) * 100 / pepe.environment.eastEnd) / 2);
    return pepe.X < 0 ? 50 - percent : 50 + percent;
}

function getImageIndex(property) {
    return Math.floor(property / 10) > 10 ? 10 : Math.floor(property / 10);
}

function initStatusIcons() {
    arrJumpIcons = [], arrEnergyIcons = [], arrAccuracyIcons = [], arrSharpIcons = [];
    for (let i = 0; i < 11; i++) {
        arrJumpIcons.push(`./img/Status/Jump/jmp${i*10}.png`);
        arrEnergyIcons.push(`./img/Status/Energy/battery${i*10}.png`);
        arrSharpIcons.push(`./img/Status/Sharpness/sharp${i*10}.png`);
        arrAccuracyIcons.push(`./img/Status/Accuracy/accuracy${i*10}.png`);
    }        
}

export function flashImg(id, timeout = 2250) {
    let image = document.getElementById(id);
    image.classList.add('flash');
    setTimeout(() => {
        image.classList.remove('flash');
    }, timeout);            
}

/**
 * loads all sounds and songs in the responsible class
 */
function initSounds() {
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