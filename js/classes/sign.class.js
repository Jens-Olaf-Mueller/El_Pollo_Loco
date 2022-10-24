import Background from './background.class.js';

export default class Sign extends Background {

    constructor(imgPath, pX, level) {
        super();
        this.loadImage(imgPath);

    }

}