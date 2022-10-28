
export default class Sound {
    arrAudio = {};
    arrPlayList = [];
    path = '';
    volume = 1;
    get isEmpty() {return Object.keys(this.arrAudio).length === 0;}
    
    constructor(path = './sound/') {
        this.path = path;
    }

    add(filename, key, muted = false) {
        if (!Array.isArray(filename)) {
            let sound = new Audio(this.path + filename);
            sound.muted = muted;
            this.arrAudio[key] = sound;
        } else {            
            let arrSongs = {};
            for (let i = 0; i < filename.length; i++) {
                const song = new Audio(this.path + filename[i]);
                arrSongs[i] = song;
                this.arrPlayList.push(song);
            }
            this.arrAudio[key] = arrSongs;
        }
    }

    remove(key) {
        try {
            delete this.arrAudio[key];
            return true;
        } catch (error) {
            console.error(error, `Key "${key}" not found.`);
            return false;
        }
    }

    clear() {         
        for (const key in this.arrAudio) {
            delete this.arrAudio[key];
        }
        this.arrAudio = {};
    }

    play(key, vol = 1) {        
        if (this.arrAudio.hasOwnProperty(key)) {            
            if (this.arrAudio[key].muted == false) {
                if (vol > 1) vol = parseFloat(vol / 100);
                this.arrAudio[key].volume = vol;
                this.arrAudio[key].play();
                return true;
            } else {
                return false;
            }            
        } else {
            console.warn(`Could not play sound. Key "${key}" not found..`);
            return false;
        }
    }

    // index = -1: play whole list...?
    playList(index = 0, vol = 1, loop = true) {        
        if (index < this.arrPlayList.length) {            
            if (this.arrPlayList[index].muted == false) {
                if (vol > 1) vol = parseFloat(vol / 100);
                this.arrPlayList[index].volume = vol;
                // add event listener to check if audio has ended -> reset to start!
                if (loop) {
                    this.arrPlayList[index].addEventListener('ended', () => {
                        this.arrPlayList[index].currentTime = 0;
                        this.arrPlayList[index].play();
                    });
                }                
                this.arrPlayList[index].play();
            }
        }
    }

    /**
     * stops either a registered sound or a sound from playlist
     * @param {string | number} key if number indicates a sound from playlist
     * @param {boolean} reset sets the audio to start after stopping
     * @returns 
     */
    stop(key, reset = false) {
        if (key != undefined) {
            try {
                if (this.arrAudio.hasOwnProperty(key)) {
                    this.arrAudio[key].pause();
                    if (reset) this.arrAudio[key].currentTime = 0;
                    return true;                
                } else if (typeof key === 'number') {
                    this.arrPlayList[key].pause();
                    if (reset) this.arrPlayList[key].currentTime = 0;
                    return true;
                }
            } catch (error) {
                console.warn(`Could not stop sound. Key "${key}" not found.`);
                return false;
            }
        } else {
            for (let k in this.arrAudio) {
                if (!Array.isArray(this.arrAudio[k])) {
                    this.stop(k);
                } else {
                    debugger;
                }
            } 
        }
    }

    fade(key, fadeAt) {
        if (this.arrAudio.hasOwnProperty(key)) {
            this.#fadeOut(this.arrAudio[key], fadeAt);
        } else if (typeof key === 'number') {
            this.#fadeOut(this.arrPlayList[key], fadeAt);
        }
    }

    #fadeOut(sound, fadeAt) {
        let fadePoint;
        if (fadeAt === undefined) {
            fadePoint = sound.duration - 5;                 // fade last 5 seconds
        } else if (fadeAt < 0 && fadeAt < sound.duration) {
            fadePoint = sound.duration - parseInt(fadeAt);  // fade -X seconds from end
        } else if (fadeAt >= 0 && fadeAt < sound.duration) {
            fadePoint = sound.currentTime;                  // fade from NOW!
        }  

        const fadeID = setInterval(() => {
            if ((sound.currentTime >= fadePoint) && (sound.volume !== 0)) {
                try {
                    sound.volume -= 0.1;
                } catch (error) {
                    this.#fadeEnd(sound, fadeID);
                }                
            }            
            if (sound.volume <= 0.01) this.#fadeEnd(sound, fadeID);
        }, 250);
    }

    #fadeEnd (sound, id) {
        clearInterval(id);
        sound.volume = 0;
        sound.pause();
        sound.currentTime = 0;
    }
}