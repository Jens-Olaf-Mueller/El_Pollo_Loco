export default class IntervalListener {
    arrIntervals = []; // as JSON !
    mainID;
    count = 0;

    constructor (id = -1) {
        this.mainID = id;
    }

    /**
     * registers an interval to the collection
     * @param {function} fnc function to be executed in the interval
     * @param {number} timeout for interval
     * @param {object} params parent class
     * @returns the id of the started interval
     */
    add (fnc, timeout, params = []) {        
        let id = setInterval(fnc, timeout, params);
        const interval = {
            ID: id,
            handler: fnc,
            timeout: timeout,
            context: params,   // optional for setInterval-function
            name: params[0].name, // optional name for the interval
            key: params[0].name + '_' + fnc.name
        };
        this.arrIntervals.push(interval);
        this.count = this.arrIntervals.length;
        return id;
    }

    /**
     * restarts a registered (existing!) interval
     * @param {number | string} interval id, key or name of the interval to be re-started  
     */
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
                this.start(int.key);
            }
        }
    }

    /**
     * stops an existing interval
     * @param {number | string} interval id, key or name of the interval to be stopped
     */
    stop (interval) {
        if (interval !== undefined) {
            let index = this.find(interval);
            if (index !== null) {
                // clearInterval-method sets ID to undefined!
                this.arrIntervals[index].ID = clearInterval(this.arrIntervals[index].ID);
            }
        } else { // stop all(!) intervals by recursive call
            for (let i = 0; i < this.arrIntervals.length; i++) {
                const int = this.arrIntervals[i];
                if (int.ID !== undefined) this.stop(int.ID);
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
     * removes either a single interval or ALL intervals of a given context from memory.
     * if interval is submitted by key, the method loops through all intervals,
     * in order to remove ALL intervals belonging to that context.
     * @param {number | string} interval numeric or string key to determine the specific interval
     */
    remove (interval) {
        if (interval) {
            let index = this.find(interval);           
            // since there can be multiple intervals per context, 
            // we loop through the array!
            while (index !== null) {
                clearInterval(this.arrIntervals[index].ID);
                this.arrIntervals.splice(index, 1);
                this.count = this.arrIntervals.length;
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
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            if (int.ID === interval || int.key === interval || int.name === interval) return i;
        }
        return null;
    }

    /**
     * for debugging only: logs out all intervals on console
     */
    list () {
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            console.log('Interval ' + int.name, int); 
        }
        console.log(this.arrIntervals.length + ' intervals registered...');
    }
}