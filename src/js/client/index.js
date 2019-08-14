// import { } from 'redux';
import { MDCTopAppBar } from '@material/top-app-bar';


class Index {
    constructor() {
        // Instantiation
        const topAppBarElement = document.querySelector('.mdc-top-app-bar');
        const topAppBar = new MDCTopAppBar(topAppBarElement);
        console.log(1);

    }
}


window.addEventListener('load', e => {
    new Index();
});