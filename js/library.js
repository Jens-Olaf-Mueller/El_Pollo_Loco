//  #######################################################################################################
//  PURPOSE		: Universal 'all-in-one' function that unites the DOM-functions
//                => document.getElementById
//                => document.getElementsByTagName
//                => document.getElementsByClassName
//                => document.getElementsByName
//                => document.querySelectorAll
//   			  
//  PARAMETER 	: selector 	= ID | classname | .class | [type] | >sub-element or <tag>
//                            if ID is not found as a valid selector, search continues 
//                            in the order: HTML-tags ==> classNames ===> names
//                            So if there is no ID matching to 'selector' but a valid
//                            HTML-tag or a class, they will be returned
//  			: [child]           	=   optional. Ignored if valid ID was found!
//              : omitted               =   a node list or HTML-collection will be returned!
//              : '~' or ':last-child'  =   returns the last child of the nodelist
//              : 0                     =   returns the first child of the nodelist
//              : number | numeric string = child[number] will be returned
//  			
//  RETURNS 	: a single element (if selector is a valid ID or child is specified)
//                in all other cases a zero-based nodelist or HTML-collection,
//                matching the selector-parameter
//                If the list contains ONLY ONE element, this element is returned only!
//
//  CALL        : $('main-content')     -   returns an element with ID 'main-content'
//                $('div','~')          -   returns the last div-container of the document
//                $('a',0)              -   returns the first link (<a>-element)
//                $('div.myClass')      -   returns a list with all div's containing class 'myClass'
//                $('div.myClass','~')  -   returns last div containing class 'myClass'
//                $('.clsNames',3)      -   returns the 4th(!) child of the wanted class list
//                $('input[type=text]') -   returns a list with all input elements, being text fields
//                $('[name]')           -   returns a list with all elements, having a 'name' attribute
//  #######################################################################################################
// prepend 'export' if you wanna import the function in a module 
export default function $(selector, child) {
    let clsNames;
    // is last-child wanted?
    let getLastChild = (child == '~' || child == ':last-child') ? true : false;
    // check, if 'child' is numeric!
    if (!isNumeric(child,true) || child < 0 ) {child = false}

    // query-selector provided?
    if (selector.includes('[') || selector.includes('.') || selector.includes('#')  || selector.includes(':') || selector.includes('>')) {
        let elements = document.querySelectorAll(selector);
        if (elements.length == 1) {return elements[0]}
        child = getLastChild ? elements.length - 1 : child;
        return (child === false) ? elements : elements[child];
    }

    // now search for ID...
    let element = document.getElementById(selector);
    if (element) { // ID was found!
        return element;     
    } else { // no ID found: continue in HTML-tags...
        let htmlTags = document.getElementsByTagName(selector);
        if (htmlTags.length > 0) {
            // don't return a collection or list, if only 1 child is contained, 
            // return this single element instead
            if (htmlTags.length == 1) {return htmlTags[0]} 
            child = getLastChild ? htmlTags.length - 1 : child;
            return (child === false) ? htmlTags : htmlTags[child];
        } else { // is the selector a class...?            
            clsNames = document.getElementsByClassName(selector);
            if (clsNames.length > 0) { 
                if (clsNames.length == 1) {return clsNames[0]}
                child = getLastChild ? clsNames.length - 1 : child;          
                return (child === false) ?  clsNames : clsNames[child];
            } else {
                // ...or is it a name finally?
                let elNames = document.getElementsByName(selector);
                if (elNames.length > 0) {
                    if (elNames.length == 1) {return elNames[0]}
                    child = getLastChild ? elNames.length - 1 : child;
                    return (child === false) ?  elNames : elNames[child];
                }                
            }
        }
    }
}

//  #####################################################################################
//  PURPOSE 	: Checks properly(!!!), if 'expression' is numeric
//   			  recognizes: undefined, NaN, Null, infinity etc.
//  PARAMETER 	: expression    -   expression to be ckecked
//              : [strAllowed]  -   boolean, optional
//                                  tells if string literals are allowed or not (default)
//  RETURNS 	: true | false
//  #####################################################################################
// prepend 'export' if you wanna import the function in a module 
// export function isNumeric(expression, strAllowed) { 
export function isNumeric(expression, strAllowed) {
    if (!strAllowed) {
        return Number.isFinite(expression); 
    } else {
        return Number.isFinite(parseFloat(expression)); 
    }
    
}

export function random (min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//  #####################################################################################
//  PURPOSE 	: Pauses the code for the provided amount of milliseconds
//  			  Calling function must be 'async' in order to make it work!
//  PARAMETERS 	: milliseconds 	= time to pause in milliseconds
//  			:  			     
//  CALL		: await sleep(3000);    -   pauses for 3 seconds 			     
//  			:  			 
//  RETURNS 	: -void-
//  #####################################################################################
export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function loadArray (path, count, extension = '.png') {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(path + i + extension)
    }
    return arr;
}

// function playSnd (file) {
//     file = './sound/' + file;
//     let audio = new Audio(file);
//     audio.play();
// }

/**
 * function for sound output
 * @param {string} filename the sound file to be played without path
 * @param {boolean} soundEnabled global variable, meant to be used in settings od the app
 */
 export function playSound (filename, soundEnabled = true) {
    if (filename && soundEnabled) {
        let path = './sound/' + filename,
            audio = new Audio(path);
        // audio.volume = volSound.value / 10; // must be defined in outer settings!
        audio.play();
        console.log(audio);
    } else if (!filename || soundEnabled === false) {
        // audio.pause();
    }
}

// export function playMusic (file) {
//     // if (currAudioID) currAudioID = null;
//     if (file) {
//         file = './sound/' + file;   // auto complete path
//         currAudioID = new Audio(file);
//         currAudioID.volume = volMusic.value / 10;
//         currAudioID.play();
//     } else if (currAudioID) {       // is there an audio object?
//         currAudioID.pause();
//         currAudioID.currentTime = 0;
//         currAudioID = null;
//     }
// }

// export function todo (msgtext, title = 'Coming soon') {
//     playSound('notify.mp3');
//     msgBox(msgtext, title,'Ok',false,true);
// }