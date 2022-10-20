
import $ from "../library.js";

export default class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    SPACE = false;
    B_KEY = false;
    Q_KEY = false;      // quit game (suicide)
    S_KEY = false;      // save game
    P_KEY = false;      // pause game
    F8_KEY = false;     // fullscreen
    CTRL_LEFT = false;  // feed chicken
    CTRL_RIGHT = false; // for further using

    constructor() {
        this.setKeyboardEvents();
        // better solution: 
        // https://stackoverflow.com/questions/11845678/adding-multiple-event-listeners-to-one-element
        this.setTouchScreenEvents();
        this.setMouseEvents();
    }

    setKeyboardEvents () {
        window.addEventListener('keydown', (event) => {
            // console.log(event);
            if (event.key == 'ArrowLeft') this.LEFT = true;
            if (event.key == 'ArrowRight') this.RIGHT = true;
            if (event.key == 'ArrowUp') this.UP = true;
            if (event.key == ' ') this.SPACE = true;
            if (event.key == 'b') this.B_KEY = true;
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
            if (event.key == 'b') this.B_KEY = false;
            if (event.key == 's') this.S_KEY = false;
            if (event.key == 'q') this.Q_KEY = false;
            if (event.key == 'p') this.P_KEY = false;
            if (event.key == 'F8') this.F8_KEY = false;
            if (event.code == 'ControlLeft') this.CTRL_LEFT = false;
            if (event.code == 'ControlRight')  this.CTRL_RIGHT = false;
        });

    }

    /**
     * event listeners for touch screen devices
     */
    setTouchScreenEvents() {
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


        $('imgBuy').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.B_KEY = true;
        });

        $('imgBuy').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.B_KEY = false;
        });

        $('imgPause').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.P_KEY = true;
        });

        $('imgPause').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.P_KEY = false;
        });

        $('imgQuit').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.Q_KEY = true;
        });

        $('imgQuit').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.Q_KEY = false;
        });

        $('imgHeart').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.CTRL_LEFT = true;
        });

        $('imgHeart').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.CTRL_LEFT = false;
        });
    }

    setMouseEvents() {
        // move left
        $('imgLeft').addEventListener('mousedown', () => { this.LEFT = true; });
        $('imgLeft').addEventListener('mouseup', () => { this.LEFT = false; });

        // move right
        $('imgRight').addEventListener('mousedown', () => { this.RIGHT = true; });
        $('imgRight').addEventListener('mouseup', () => { this.RIGHT = false; });

        // jump
        $('imgUp').addEventListener('mousedown', () => { this.UP = true; });
        $('imgUp').addEventListener('mouseup', () => { this.UP = false; });

        // take | action
        $('imgAction').addEventListener('mousedown', () => { this.SPACE = true; });
        $('imgAction').addEventListener('mouseup', () => { this.SPACE = false; });

        // pause
        $('imgPause').addEventListener('mousedown', () => { this.P_KEY = true; });
        $('imgPause').addEventListener('mouseup', () => { this.P_KEY = false; });

        // quit game
        $('imgQuit').addEventListener('mousedown', () => { this.Q_KEY = true; });
        $('imgQuit').addEventListener('mouseup', () => { this.Q_KEY = false; });

        // buy
        $('imgBuy').addEventListener('mousedown', () => { this.B_KEY = true; });
        $('imgBuy').addEventListener('mouseup', () => { this.B_KEY = false; });

        // feed
        $('imgHeart').addEventListener('mousedown', () => { this.CTRL_LEFT = true; });
        $('imgHeart').addEventListener('mouseup', () => { this.CTRL_LEFT = false; });
    }
}