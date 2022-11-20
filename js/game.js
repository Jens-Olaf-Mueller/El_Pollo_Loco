/** 
 * import all required functions & classes from outer .js-files
 */
import Game from './classes/game.class.js';
import World from './classes/world.class.js';
import Sound from './classes/sound.class.js';
import Backend from './classes/backend.class.js';
import IntervalListener from './classes/intervals.class.js';
import { loadSettings, saveSettings, gameSettings } from './settings_mod.js';
import $, { sleep, random, getTime$ } from './library.js';
import { APP_NAME, SOUNDS, DEF_HIGHSCORES,
         ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, IMG_GAMEOVER, IMG_START, BTN_PATH,
         homeScreen, introScreen, mainScreen, shopScreen, navBar, statusBar, sideBar, posBar, 
         btnDemo, btnStart, btnClose, btnMusic, btnSound, btnPause, btnFeed, btnShop, canvasParent
        } from './const.js';
// import {'*'} from './const.js';
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
export const BACKEND = new Backend();
let world, gHighScores,
    arrEnergyIcons, 
    arrJumpIcons, 
    arrAccuracyIcons, 
    arrSharpIcons,
    gameIsRunning,
    autoStart;
export let demoMode;

runApp();

function runApp() {
    setEventListeners();
    loadSettings(APP_NAME);
    loadFont(fontZabars);
    loadHighScores();
    initSounds();
    // coming from help or settings?
    autoStart = sessionStorage.getItem(APP_NAME + '_AutoStart');
    if (autoStart === 'true') {
        sessionStorage.setItem(APP_NAME + '_AutoStart', false);
        startGame();
        return;
    }
     // check for the very first start and show help if wanted
    gameIsRunning = sessionStorage.getItem(APP_NAME + '_IsRunning');
    if (!gameIsRunning) {
        sessionStorage.setItem(APP_NAME + '_IsRunning', true);
        if (gameSettings.showHelpOnStart) window.location.href = 'help.html';
    }
}

function startGame() {      
    demoMode = false;
    saveSettings(APP_NAME); 
    initStatusIcons();
    document.body.style.backgroundImage = '../img/Intro_Outro/desert2_1920x1080.jpg';  
    displayControls();
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
    await displayControls(false);
    document.body.style.backgroundImage = IMG_START[random(0,IMG_START.length-1)];
    if (gameSettings.debugMode) console.log('G A M E  O V E R  ! ! !'); 
}

/**
 * displays the intro screen
 * @param {number} level shows the intro screen of the given level
 */
export async function showIntroScreen(level) {
    introScreen.fadeIn(4250); 
    if (gameSettings.soundEnabled && !gameSettings.musicEnabled) Sounds.play('jingle');
    $('introH1').innerText = 'Level  ' + level;
    // canvas.classList.remove('hidden');
    introScreen.element.style.backgroundImage = IMG_START[random(0,IMG_START.length-1)];       
    introScreen.show();
    await sleep(2500); 
    introScreen.fadeOut(4250); 

}

/**
 * displays the game over screen
 */
export async function showGameoverScreen() {
    introScreen.fadeIn(4250);
    $('introH1').innerText = '';
    canvas.classList.add('hidden');
    introScreen.element.style.backgroundImage = IMG_GAMEOVER;
    introScreen.show();        
    await sleep(5000);
}

async function displayControls(state = true) {
    if (state == true) {
        shopScreen.hide();
        homeScreen.hide();
        mainScreen.show();
        canvas.classList.remove('hidden');
        posBar.show();
        navBar.show();
        sideBar.show();
        statusBar.show();
        btnClose.show();  
        return;
    }    
    posBar.hide();
    navBar.hide();
    sideBar.hide();
    statusBar.hide();
    btnClose.hide();        
    await showGameoverScreen();
    mainScreen.hide();
    introScreen.hide();
    homeScreen.show();
}

/**
 * reset the old instance of the world class for restart!
 */
 function worldTerminate() {
    Intervals.remove('Pepe'); // MUST be executed first!
    clearInterval(world.mainID);
    Intervals.clear();
    if (newHighScore()) BACKEND.setItem(APP_NAME + '_HighScores', gHighScores);
    if (world.levelNo > gameSettings.lastLevel) saveSettings(APP_NAME, world.Pepe);
    window.cancelAnimationFrame(world.reqAnimationFrameID);
    world.reqAnimationFrameID = undefined;
    world = undefined;    
}

function setEventListeners() {
    btnStart.addEventListener('click', startGame);       
    btnDemo.addEventListener('click', playDemo);
    canvas.addEventListener('click', closeDemo);
    btnClose.element.addEventListener('click', closeDemo); 
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Escape') {
            if (demoMode) closeDemo();
            if (world.level.insideShop) world.level.shop.exit();
        } 
    })

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
    btnClose.element.dataset.tooltip = 'Quit demo';
    btnClose.show();
    statusBar.hide();
    sideBar.hide();
    posBar.hide();
    canvasParent.style.justifyContent = 'center'; 
    canvas.classList.remove('hidden');
    mainScreen.show();
    video.muted = true;
    if (Sounds.isEmpty) initSounds();
    Sounds.playList(0, 0.5);
    video.play();
}

function closeDemo() {
    if (demoMode) {
        demoMode = false;
        mainScreen.hide();
        canvasParent.style.justifyContent = 'space-evenly';
        btnClose.element.dataset.tooltip = 'Quit game';
        video.pause();
        video.currentTime = 0;
        Sounds.stop(0);
        Sounds.arrPlayList[0].currentTime = 0;
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

async function loadHighScores() {
    // let response = await BACKEND.loadJSONFromServer();
    debugger
    gHighScores = await BACKEND.getItem(APP_NAME + '_HighScores') || DEF_HIGHSCORES;
    renderHighScores();
}


function renderHighScores() {
    const divHighScore = $('.highscore');
    divHighScore.innerHTML = '';
    for (let i = 0; i < gHighScores.length; i++) {
        const rank = gHighScores[i];
        divHighScore.innerHTML += `
            <div class="highscore-item">
                <p>${i+1}. ${rank.name}</p><p>${rank.score.toLocaleString()}</p>
            </div>`;
    }
}


function newHighScore() {
    let success = false;    
    for (let i = gHighScores.length-1; i > -1 ; i--) {        
        success = (world.Pepe.score > gHighScores[i].score);
        if (success) {
            //{score: 10000, level: 5, name: 'Pepe', time: 1668638556630}
            gHighScores[i].score = world.Pepe.score;
            gHighScores[i].level = world.levelNo;
            gHighScores[i].time = getTime$();
            gHighScores[i].name = promptPlayerName();
            sortHighScores('score');
            renderHighScores();
            break;
        } 
    }
    return success;
}


/**
 * Sorts the JSON-array in descending order
 * @param {string} key sort order key of the JSON-array 
 */
 function sortHighScores(key) {
    // to sort ascending use:
    // gHighScores.sort((prev, next)=> {return prev[key] - next[key]});
    gHighScores.sort((prev, next)=> {return next[key] - prev[key]});
    // or: gHighScores.sort(compareJSON(key));
}


/**
 * helper function to sort a JSON-array
 * @param {string} key JSON key for sort order
 * @returns 1 = greater than | -1 = smaller than | 0 = equal
 */
function compareJSON(key) {    
    return function(prev, next) {    
        if (prev[key] > next[key]) return 1; 
        if (prev[key] < next[key])  return -1;   
        return 0;    
    }    
} 

function promptPlayerName() {
    let player = prompt('Please enter your name', 'Pepe');
    debugger
    if (player != null) return player;
}

export function updateStatusbar(pepe) {
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
    btnShop.toggleClass('hidden', (!(pepe.isInFrontOfShop && pepe.environment.level.shop.isOpen)));
    
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
    let result = Math.floor(property / 10) > 10 ? 10 : Math.floor(property / 10);
    if (result < 0) result = 0;
    return result;
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

export function flashElement(id, timeout = 2250) {
    let element = $(id);
    element.classList.add('flash');
    setTimeout(() => {
        element.classList.remove('flash');
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