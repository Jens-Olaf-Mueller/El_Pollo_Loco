export default class IntervalListener {
    arrIntervals = []; // as JSON !
    mainID = -1;
    constructor (id) {
        this.mainID = id;
    }

    add (fnc, timeout, params, name) {
        debugger
        console.log('Fnc-Name: ' , fnc.name )
        let id = setInterval(fnc, timeout, params);
        this.arrIntervals.push({
            ID: id,
            handler: fnc,
            timeout: timeout,
            args: params,   // optional for setInterval-function
            name: fnc.name  // optional name for the interval
        });
        return id;
    }

    /**
     * removes an interval with teh given id and / or name
     * @param {number} id number of interval to be removed
     * @param {string} name optional name of interval to be removed
     */
    remove (id, name) {

    }

    stop (interval) {
        // iterate over each element in the array
        for (let i = 0; i < this.arrIntervals.length; i++) {
            if (this.arrIntervals[i].ID == interval) {
                // we found it
                this.arrIntervals[i].ID = clearInterval(id);
                break;
            }
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

    find (id) {
// var obj = [
//     {"name": "Afghanistan", "code": "AF"}, 
//     {"name": "Åland Islands", "code": "AX"}, 
//     {"name": "Albania", "code": "AL"}, 
//     {"name": "Algeria", "code": "DZ"}
//   ];

        // iterate over each element in the array
        for (let i = 0; i < this.arrIntervals.length; i++){
            // look for the entry with a matching `code` value
            if (this.arrIntervals[i].ID == id){
            // we found it
            // obj[i].name is the matched result
            }
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

