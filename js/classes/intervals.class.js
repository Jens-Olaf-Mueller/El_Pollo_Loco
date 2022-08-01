export default class IntervalListener {
    arrIntervals = []; // as JSON !
    mainID;
    constructor (id = -1) {
        this.mainID = id;
    }

    add (fnc, timeout, params = []) {
        debugger
        console.log('Fnc-Name: ' , fnc.name )
        let id = setInterval(fnc, timeout, params);
        const interval = {
            ID: id,
            handler: fnc,
            timeout: timeout,
            args: params,   // optional for setInterval-function
            name: fnc.name  // optional name for the interval
        };
        this.arrIntervals.push(interval);
        return id;
    }

    start (interval) {
        let index = this.find(interval);
        if (index) {
            let jsonInt = this.arrIntervals[index];
            jsonInt.ID = setInterval (jsonInt.handler, jsonInt.timeout, jsonInt.args);
        }
    }

    stop (interval) {
        let index = this.find(interval);
        if (index) {
            this.arrIntervals[index].ID = clearInterval(this.arrIntervals[index].ID);
        }
    }

    /**
     * clears all saved intervals from store
     */
    clear () {
        this.arrIntervals.forEach(interval => {
            this.remove(interval.ID);
        });
        this.arrIntervals = [];
    }

    remove (interval) {
        if (typeof (interval) === 'number') {
            clearInterval(this.arrIntervals[interval].ID);
            this.arrIntervals[interval].splice(interval, 1);
        } else {
            let index = this.find(interval);
            if (index) {
                clearInterval(this.arrIntervals[index].ID);
                this.arrIntervals[index].splice(index, 1);
            }
        }
        
    }

    find (interval) {
        // iterate over each element in the array
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            if (int.ID === interval || int.name == interval){
                return i;
            }
        }
        return null;
    }

    /**
     * for debugging only
     */
    list () {
        for (let i = 0; i < this.arrIntervals.length; i++) {
            const int = this.arrIntervals[i]; 
            console.log('Interval ' + int.name, int); 
        }
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

