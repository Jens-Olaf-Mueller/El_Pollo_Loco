export default class Container {
    docID;
    element;
    #arrEvents = [];
    constructor (id) {
        this.docID = id;
        this.element = document.getElementById(id);
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
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