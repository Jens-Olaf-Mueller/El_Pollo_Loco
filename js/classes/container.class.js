export default class Container {
    documentID;
    element;
    fadeTime = 250;
    get display() {return this.#displayStyle;}
    set display(style) {
        this.#displayStyle = style;
    }
    #displayStyle = 'block';
    #arrEvents = []; 


    constructor (id, display) {
        this.documentID = id;
        this.element = document.getElementById(id);        
        if (display) {
            this.#displayStyle = display;
        } else if (this.element !== null) { // save the current display style!
            this.#displayStyle = window.getComputedStyle(this.element).display; 
        }        
    }

    show(display) {
        this.element.classList.remove('hidden');
        // this.element.style.display = display ? display : this.#displayStyle;
    }

    hide() {
        this.element.classList.add('hidden');
        // this.element.style.display = 'none';
    }

    fadeIn(time) {
        if (time == undefined) time = this.fadeTime;
        this.element.style.transition = `opacity ${time}ms linear 0ms`;
        this.element.style.opacity = 1;
    }
    /**
     * fades the element out
     * @param {number} time in milliseconds 
     */
    fadeOut(time) {
        if (time == undefined) time = this.fadeTime;
        this.element.style.transition = `opacity ${time}ms linear 0ms`;
        this.element.style.opacity = 0;
    }

    setEventListener(type, handler) {
        this.#arrEvents.push(handler.name);
        this.element.addEventListener(type, handler);
    }

    addClass(classname) {
        this.element.classList.add(classname);
    }

    removeClass(classname) {
        this.element.classList.remove(classname);
    }

    toggleClass(classname, force) {
        this.element.classList.toggle(classname, force);
    }
}