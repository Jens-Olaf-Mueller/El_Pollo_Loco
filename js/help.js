import $ from "./library.js";
import { APP_NAME } from './const.js';

const details = Array.from($('details'));
const home = $('btnAutoStart');

// delete the auto start flag in sessionstore when site is loaded
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem(APP_NAME + '_AutoStart', false);
});

home.addEventListener('click', () => {
    sessionStorage.setItem(APP_NAME + '_AutoStart', true);
    window.location.href = 'index.html';
}, true)

details.forEach(detail => {
    detail.addEventListener('click', (event) => {
        if(!event.target.open) {
            // let status = event.target.open;
            closeAllDetails(details);
            // if (!status) event.target.open = true;
            event.target.open = !event.target.open;
           
        } 
    });
});

function closeAllDetails (arr) {
    arr.forEach(item => {
        item.open = undefined;
    });
}