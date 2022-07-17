/**
 * Frames per second
 */
const FPS = 60;

const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;
// const CANVAS_HEIGHT = document.getElementById('canvas').getBoundingClientRect().height;
// const CANVAS_WIDTH = document.getElementById('canvas').getBoundingClientRect().width;

const ICON_ENERGY = document.getElementById('imgEnergy'),
    ICON_JUMP = document.getElementById('imgJump'),
    ICON_ACCURACY = document.getElementById('imgAccuracy'),
    ICON_SHARPNESS = document.getElementById('imgSharpness');

const APP_NAME = 'El Pollo Loco';
const PEPE = 'Pepe';
const IMG_GAMEOVER ="url('../img/Intro_Outro/gameover_screen/3.Game over.png')";
const IMG_START = ["url('../img/Intro_Outro/start_screen/screen1.png')",
                   "url('../img/Intro_Outro/start_screen/screen2.png')"];
const SOUNDS = {
    songs: ['Santa Esmeralda.mp3','Chicken Song.mp3'],
    ouch: "ouch.mp3",
    plopp: "plopp.mp3",
    found: "item found.mp3",
    coin: "coin click.mp3",
    money: "no money.mp3",
    bees: "flying bees.mp3",
    gameover: "game over.mp3",
    jingle: "jingle.mp3",
    splat: "splat.mp3",
    bottle: "bottle collected.mp3",
    glass: "glass.mp3",
    chicken: "chicken alert.mp3",
    snake: "rattle snake.mp3",
    walk: "walk.mp3",
    seed: "seeds.mp3",
    jump: "jump.mp3",
    gun: "pump gun.mp3",
    shot: "shot gun.mp3"
};

export { FPS, CANVAS_HEIGHT, CANVAS_WIDTH, APP_NAME, PEPE, ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, SOUNDS, IMG_GAMEOVER, IMG_START };