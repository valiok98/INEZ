import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';

class Index {
    constructor() {
        // Instantiation
        const list = new MDCList(document.querySelector('.content .mdc-list'));
        const listItemRipples = list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
        const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
    }
}


window.addEventListener('load', e => {
    new Index();
});