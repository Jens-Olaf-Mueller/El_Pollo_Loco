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
const ARR_SOUNDS = [
    {ouch: "ouch.mp3"},
    {plopp: "plopp.mp3"},
    {found: "item found"},
    {coin: "coin click.mp3"},
    {splat: "splat.mp3"},
    {bottle: "bottle collected.mp3"}
];


export { FPS, CANVAS_HEIGHT, CANVAS_WIDTH, APP_NAME, PEPE, ICON_ENERGY, ICON_JUMP, ICON_ACCURACY, ICON_SHARPNESS, ARR_SOUNDS };