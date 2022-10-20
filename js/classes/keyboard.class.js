
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

    arrButtons = ['imgLeft','imgRight','imgUp','imgAction','imgBuy','imgPause','imgQuit','imgHeart'];
    arrEvents = ['mousedown','mouseup','touchstart','touchend'];

    constructor() {
        this.setKeyboardEvents();
        this.buttonEvents();
        // better solution: 
        // https://stackoverflow.com/questions/11845678/adding-multiple-event-listeners-to-one-element        
    }

    setKeyboardEvents () {
        ['keydown','keyup'].forEach((evt) => {
            window.addEventListener(evt, (event) => {
                // console.log(event);
                if (event.key == 'ArrowLeft') this.LEFT = (evt == 'keydown') ? true : false;
                if (event.key == 'ArrowRight') this.RIGHT = (evt == 'keydown') ? true : false;
                if (event.key == 'ArrowUp') this.UP = (evt == 'keydown') ? true : false;
                if (event.key == ' ') this.SPACE = (evt == 'keydown') ? true : false;
                if (event.key == 'b') this.B_KEY = (evt == 'keydown') ? true : false;
                if (event.key == 's') this.S_KEY = (evt == 'keydown') ? true : false;
                if (event.key == 'q') this.Q_KEY = (evt == 'keydown') ? true : false;
                if (event.key == 'p') this.P_KEY = (evt == 'keydown') ? true : false;
                if (event.key == 'F8') this.F8_KEY = (evt == 'keydown') ? true : false;
                if (event.code == 'ControlLeft') this.CTRL_LEFT = (evt == 'keydown') ? true : false;
                if (event.code == 'ControlRight')  this.CTRL_RIGHT = (evt == 'keydown') ? true : false;
            });
        })
    }

    buttonEvents() {
        for (let i = 0; i < this.arrButtons.length; i++) {
            const id = this.arrButtons[i], btn = document.getElementById(id);
            this.arrEvents.forEach((evt) => {
                btn.addEventListener(evt, (event) => {
                    event.preventDefault();
                    let state = evt == 'mousedown' || evt == 'touchstart' ? true : false;
                    switch (id) {
                        case 'imgLeft': this.LEFT = state;
                            break;
                        case 'imgRight': this.RIGHT = state;
                            break;
                        case 'imgUp': this.UP = state;
                            break;
                        case 'imgAction': this.SPACE = state;
                            break;
                        case 'imgBuy': this.B_KEY = state;
                            break;
                        case 'imgPause': this.P_KEY = state;
                            break;
                        case 'imgQuit': this.Q_KEY = state;
                            break;
                        case 'imgHeart': this.CTRL_LEFT = state;
                            break;
                    }
                });
            });
        }

        // this.arrEvents.forEach((evt) => {
        //     $('imgLeft').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.LEFT = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgRight').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.RIGHT = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgUp').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.UP = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgAction').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.SPACE = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgBuy').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.B_KEY = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgPause').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.P_KEY = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgQuit').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.Q_KEY = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });

        //     $('imgHeart').addEventListener(evt, (event) => {
        //         event.preventDefault();
        //         this.CTRL_LEFT = evt == 'mousedown' || evt == 'touchstart' ? true : false;
        //     });
        // });
    }

}