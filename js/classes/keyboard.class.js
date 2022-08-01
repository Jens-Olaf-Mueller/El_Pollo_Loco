
import $ from "../library.js";

export default class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    SPACE = false;
    Q_KEY = false;      // quit game (suicide)
    S_KEY = false;      // save game
    P_KEY = false;      // pause game
    F8_KEY = false;     // fullscreen
    CTRL_LEFT = false;  // feed chicken
    CTRL_RIGHT = false; // for further using

    constructor() {
        this.setEventListeners();
    }

    setEventListeners () {
        window.addEventListener('keydown', (event) => {
            // console.log(event);
            if (event.key == 'ArrowLeft') this.LEFT = true;
            if (event.key == 'ArrowRight') this.RIGHT = true;
            if (event.key == 'ArrowUp') this.UP = true;
            if (event.key == ' ') this.SPACE = true;
            if (event.key == 's') this.S_KEY = true;
            if (event.key == 'q') this.Q_KEY = true;
            if (event.key == 'p') this.P_KEY = true;
            if (event.key == 'F8') this.F8_KEY = true;
            if (event.code == 'ControlLeft') this.CTRL_LEFT = true;
            if (event.code == 'ControlRight')  this.CTRL_RIGHT = true;
        });
            
        window.addEventListener('keyup', (event) => {
            // console.log(event);
            if (event.key == 'ArrowLeft') this.LEFT = false;
            if (event.key == 'ArrowRight') this.RIGHT = false;
            if (event.key == 'ArrowUp') this.UP = false;
            if (event.key == ' ') this.SPACE = false;
            if (event.key == 's') this.S_KEY = false;
            if (event.key == 'q') this.Q_KEY = false;
            if (event.key == 'p') this.P_KEY = false;
            if (event.key == 'F8') this.F8_KEY = false;
            if (event.code == 'ControlLeft') this.CTRL_LEFT = false;
            if (event.code == 'ControlRight')  this.CTRL_RIGHT = false;
        });

        // event listeners for touch screen devices
        $('imgLeft').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.LEFT = true;
        });

        $('imgLeft').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.LEFT = false;
        });

        $('imgRight').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.RIGHT = true;
        });

        $('imgRight').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.RIGHT = false;
        });

        $('imgUp').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.UP = true;
        });

        $('imgUp').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.UP = false;
        })

        $('imgAction').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.SPACE = true;
        });
        
        $('imgAction').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.SPACE = false;
        })
    }
}

