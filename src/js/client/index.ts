import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
// import { store } from './store';

class Index {

    private store: any;
    private list: any;
    private textField: any;

    constructor() {
        // this.store = store;
        // Instantiation.
        this.list = new MDCList(document.querySelector('.content .mdc-list'));
        this.textField = new MDCTextField(document.querySelector('.mdc-text-field'));

        // Apply ripple effect to the list items.
        this.list.listElements.map((listItemEl: any) => new MDCRipple(listItemEl));

        this.attach_handlers();
    }

    /**
     * Add a DOM item to the list.
     * 
     * @param {*} comment 
     */
    add_list_item(comment: string) { }

    /**
     * Remove a DOM item from the list.
     * 
     * @param {*} comment 
     */
    remove_list_item(comment: string) { }

    attach_handlers() {

    }
}


window.addEventListener('load', e => {
    new Index();
});