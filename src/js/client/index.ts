import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { fromEvent } from 'rxjs';
import { throttleTime, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
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
        const wasteBin: HTMLSpanElement = li.querySelector('span.material-icons');
        wasteBin.addEventListener('click', (e: MouseEvent) => {
            const selIndex = this.list.foundation_.adapter_.getFocusedElementIndex();
            this.store.dispatch({ type: 'REMOVE_ENTRY', entryIndex: selIndex });
        });
        wasteBin.addEventListener('mouseover', (e: MouseEvent) => {
            wasteBin.style.color = 'red';
        });
        wasteBin.addEventListener('mouseleave', (e: MouseEvent) => {
            wasteBin.style.color = 'rgba(0, 0, 0, 0.38)';
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
        fromEvent(this.textField.input_, 'keyup')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                tap((e: KeyboardEvent) => {
                    const userInput: string = this.textField.input_.value.trim();
                    const scriptTag: HTMLScriptElement = document.createElement('script');
                    const previousScriptTag = document.querySelector('script#suggestionsScript');
                    if (previousScriptTag) {
                        previousScriptTag.remove();
                    }
                    scriptTag.setAttribute('id', 'suggestionsScript');
                    scriptTag.src = `https://www3.dict.cc/inc/ajax_autosuggest.php?s=${userInput}&jsonp=1&check_typo=1&lp_id=1`;
                    document.querySelector('html').appendChild(scriptTag);

                    if (e.key === 'Enter' && userInput !== '') {
                        this.store.dispatch({ type: 'ADD_ENTRY', entry: userInput });
                        this.textField.input_.value = '';
                    }
                })
            ).subscribe();


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

