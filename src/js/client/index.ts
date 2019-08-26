import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { store } from './store';

class Index {

    private store: any;
    private list: any;
    private textField: any;
    private entriesLength: number;

    constructor() {
        this.store = store;
        // Tex field component.
        this.textField = new MDCTextField(document.querySelector('.mdc-text-field'));

        // List component.
        this.list = new MDCList(document.querySelector('.content .mdc-list'));
        this.list.listElements.map((listItemEl: any) => new MDCRipple(listItemEl));
        // Track the number of entries in the list.
        this.entriesLength = this.list.foundation_.adapter_.getListItemCount();

        this.attach_handlers();
    }

    /**
     * Add a DOM item to the list.
     * 
     * @param {*} entry 
     */
    add_list_item(entry: string) {
        const li: HTMLLIElement = document.createElement('li');
        li.classList.add('mdc-list-item');
        li.setAttribute('tabIndex', '0');
        li.innerHTML = `<span class='mdc-list-item__text'>${entry}</span>
            <span class="mdc-list-item__meta material-icons" aria-hidden="true">delete</span>`;
        li.querySelector('span.material-icons').addEventListener('click', (e: MouseEvent) => {
            const selIndex = this.list.foundation_.adapter_.getFocusedElementIndex();
            this.store.dispatch({ type: 'REMOVE_ENTRY', entryIndex: selIndex });
        });
        this.list.root_.appendChild(li);
    }

    /**
     * Remove a DOM item from the list.
     * 
     * @param {*} entryIndex 
     */
    remove_list_item(entryIndex: number) {
        const li = this.list.root_.querySelector(`li:nth-of-type(${entryIndex + 1})`);
        li.remove();
    }

    attach_handlers() {
        this.textField.input_.addEventListener('keyup', (e: KeyboardEvent) => {
            const userInput: string = this.textField.input_.value.trim();
            if (e.key === 'Enter' && userInput !== '') {
                this.store.dispatch({ type: 'ADD_ENTRY', entry: userInput });
                this.textField.input_.value = '';
            }
        });

        this.store.subscribe(() => {
            const storeEntries: { values: string[], entryIndex: number } = this.store.getState().entries;
            if (storeEntries.values.length > this.entriesLength) {
                this.entriesLength++;
                // Add the newly typed entry to the list.
                this.add_list_item(storeEntries.values[storeEntries.values.length - 1]);
            } else if (storeEntries.values.length < this.entriesLength) {
                this.entriesLength--;
                // Remove the deleted entry from the list.
                this.remove_list_item(storeEntries.entryIndex);
            }
        })
    }
}


window.addEventListener('load', e => {
    new Index();
});