import $ from "../library.js";
// see also: https://stackoverflow.com/questions/11845678/adding-multiple-event-listeners-to-one-element 
export default class Keyboard {
    arrButtons = ['imgLeft','imgRight','imgUp','imgAction','imgBuy','imgPause','divClose','imgHeart'];
    arrEvents = ['mousedown','mouseup','touchstart','touchend'];

    constructor() {
        this.initKeys();
        this.setKeyboardEvents();
        this.buttonEvents();      
    }

    initKeys() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.SPACE = false;
        this.B_KEY = false;         // buy items
        this.Q_KEY = false;         // quit game (suicide)
        this.S_KEY = false;         // save game
        this.P_KEY = false;         // pause game
        this.F8_KEY = false;        // fullscreen
        this.CTRL_LEFT = false;     // feed chicken
        this.CTRL_RIGHT = false;    // for further using
        this.ESCAPE = false;        // same as quit
    }

    setKeyboardEvents () {
        ['keydown','keyup'].forEach((evt) => {
            window.addEventListener(evt, (event) => {
                let state = (evt == 'keydown') ? true : false;
                if (event.key == 'ArrowLeft') this.LEFT = state;
                if (event.key == 'ArrowRight') this.RIGHT = state;
                if (event.key == 'ArrowUp') this.UP = state;
                if (event.key == ' ') this.SPACE = state;
                if (event.key == 'b') this.B_KEY = state;
                if (event.key == 's') this.S_KEY = state;
                if (event.key == 'Escape') this.ESCAPE = state;
                if (event.key == 'q') this.ESCAPE = state;
                if (event.key == 'p') this.P_KEY = state;
                if (event.key == 'F8') this.F8_KEY = state;                
                if (event.code == 'ControlLeft') this.CTRL_LEFT = state;
                if (event.code == 'ControlRight')  this.CTRL_RIGHT = state;
            });
        })
    }

    buttonEvents() {
        for (let i = 0; i < this.arrButtons.length; i++) {
            const id = this.arrButtons[i], btn = document.getElementById(id);
            this.arrEvents.forEach((evt) => {
                btn.addEventListener(evt, (event) => {
                    event.preventDefault();
                    let state = (evt == 'mousedown' || evt == 'touchstart') ? true : false;
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
                        case 'divClose': this.ESCAPE = state;                            
                            break;
                        case 'imgHeart': this.CTRL_LEFT = state;                            
                            break;
                    }
                });
            });
        }
    }
}