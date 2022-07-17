export default class Container {
    docID;
    element;
    thisHTML;
    constructor (id) {
        this.docID = id;
        this.element = document.getElementById(id);
    }

    show () {
        this.element.classList.remove('hidden');
    }

    hide (){
        this.element.classList.add('hidden');
    }

    addClass (classname) {
        this.element.classList.add(classname);
    }

    removeClass (classname) {
        this.element.classList.remove(classname);
    }
}