import $ from "./library.js";

const details = Array.from($('details'));

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