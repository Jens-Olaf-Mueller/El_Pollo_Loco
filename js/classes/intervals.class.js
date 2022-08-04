export default class IntervalListener {
    arrIntervals = []; // as JSON !
    mainID;
    constructor (id = -1) {
        this.mainID = id;
    }

    add (fnc, timeout, params = []) {        
        let id = setInterval(fnc, timeout, params);
        const interval = {
            ID: id,
            handler: fnc,
            timeout: timeout,
            context: params,   // optional for setInterval-function
            name: fnc.name, // optional name for the interval
            key: params[0].name + this.arrIntervals.length
        };
        this.arrIntervals.push(interval);
        return id;
    }

    start (interval) {
        if (interval !== undefined) {
            let index = this.find(interval);
            if (index !== null) {
                const jsonInt = this.arrIntervals[index];
                jsonInt.ID = setInterval (jsonInt.handler, jsonInt.timeout, jsonInt.context);
            }
        } else { // start all(!) intervals
            for (let i = 0; i < this.arrIntervals.length; i++) {

                const int = this.arrIntervals[i];
                debugger
                this.start(int.key);
            }
            this.list();
            debugger
        }
    }

    stop (interval) {
        if (interval !== undefined) {
            let index = this.find(interval);
            if (index !== null) {
                // clearInterval-method sets ID to undefined!
                this.arrIntervals[index].ID = clearInterval(this.arrIntervals[index].ID);
            }
        } else { // stop all (!) intervals
            for (let i = 0; i < this.arrIntervals.length; i++) {
                const int = this.arrIntervals[i];
                if (int.ID === undefined) break;
                this.stop(int.ID);
            }
        }        
    }

    /**
     * removes all saved intervals from memory
     */
    clear () {
        this.arrIntervals.forEach(interval => {
            this.remove(interval.ID);
        });
        this.arrIntervals = [];
    }

    /**
     * removes a single interval from memory.
     * if a string is provides, ALL intervals from these context will be removed!
     * @param {number | string} interval numeric or string key to determine the specific interval
     */
    remove (interval) {
        if (typeof (interval) === 'number') {
            clearInterval(this.arrIntervals[interval].ID);
            this.arrIntervals[interval].splice(interval, 1);
        } else {
            let index = this.find(interval);
            // since there can be multiple intervals per context, we loop...
            while (index !== null) {
                // debugger
                clearInterval(this.arrIntervals[index].ID);
                this.arrIntervals.splice(index, 1);
                index = this.find(interval);
            }
        }
        
    }

    /**
     * searches for a given interval
     * @param {number | string} interval either a numeric value (represents the ID)
     * or a string as key, that has been saved in the add-method
     * @returns index of the interval in array or null, if interval was not found
     */
    find (interval) {
        // iterate over each element in the array
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            if (int.ID === interval || int.key === interval){
                return i;
            }
        }
        return null;
    }

    /**
     * for debugging only: logs out all intervals on console
     */
    list () {
        // debugger
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            console.log('Interval ' + int.name, int); 
        }
        console.log('Länge: ' + this.arrIntervals.length );
    }
}

// ###############################################################

// let arrIntervals = []; 

// call:
// setPausableInterval( function(){
//     console.log('hallo');
// }, 1000);

// function setPausableInterval(fnc, timeout, params, key) {
//     let id = setInterval(fnc, timeout, params);
//     arrIntervals.push({
//         interval: id,
//         handler: fnc,
//         timeout: timeout,
//         args: params, // optional for setInterval-function
//         key: key // optional, could be a name or parent
//     });
//     return id;
// }

// ###############################################################

