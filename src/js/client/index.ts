import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Menu } from './menu';

class Index {

    public store: any;
    public listObj: { dom: HTMLDivElement, mdc: MDCList };
    public textFieldObj: { dom: HTMLDivElement, mdc: MDCTextField };
    public entriesLength: number;
    public menu: Menu;

    constructor() {


        this.store = window.store;
        // Tex field component.
        this.listObj = {
            dom: document.querySelector('.content .mdc-list.entries_list'),
            mdc: new MDCList(document.querySelector('.content .mdc-list.entries_list'))
        };
        this.textFieldObj = {
            dom: document.querySelector('.mdc-text-field'),
            mdc: new MDCTextField(document.querySelector('.mdc-text-field'))
        };
        // Initialize MDC components.
        this.listObj.mdc.getDefaultFoundation().init();
        this.textFieldObj.mdc.getDefaultFoundation().init();
        // List component.
        this.listObj.mdc.listElements.map((listItemEl: any) => new MDCRipple(listItemEl));
        // Track the number of entries in the list.
        this.entriesLength = this.listObj.mdc.getDefaultFoundation()['adapter_'].getListItemCount();

        // Suggestions menu component.
        this.menu = new Menu();
        this.attach_handlers();
    }

    /**
     * Add a DOM item to the list.
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
            const selIndex = this.listObj.mdc.getDefaultFoundation()['adapter_'].getFocusedElementIndex();
            this.store.dispatch({ type: 'REMOVE_ENTRY', entryIndex: selIndex });
        });
        wasteBin.addEventListener('mouseover', (e: MouseEvent) => {
            wasteBin.style.color = 'red';
        });
        wasteBin.addEventListener('mouseleave', (e: MouseEvent) => {
            wasteBin.style.color = 'rgba(0, 0, 0, 0.38)';
        });
        this.listObj.dom.appendChild(li);
    }

    /**
     * Remove a DOM item from the list.
     * @param {*} entryIndex
     */
    remove_list_item(entryIndex: number) {
        const li = this.listObj.dom.querySelector(`li:nth-of-type(${entryIndex + 1})`);
        li.remove();
    }

    /**
     * Load the suggestions script over JSONP, which triggers the callback in /dist/display-suggestions.js.
     * @param userInput 
     */
    load_suggestions(userInput: string) {
        const scriptTag: HTMLScriptElement = document.createElement('script');
        const previousScriptTag = document.querySelector('script#suggestionsScript');
        if (previousScriptTag) {
            previousScriptTag.remove();
        }
        scriptTag.setAttribute('id', 'suggestionsScript');
        scriptTag.src = `https://www3.dict.cc/inc/ajax_autosuggest.php?s=${userInput}&jsonp=1&check_typo=1&lp_id=1`;
        document.querySelector('html').appendChild(scriptTag);
    }

    /**
     * All handlers for the component and store.
     */
    attach_handlers() {
        fromEvent(this.textFieldObj.dom.querySelector('input'), 'keyup')
            .pipe(
                tap((e: KeyboardEvent) => {
                    const userInput = this.textFieldObj.dom.querySelector('input').value;
                    if (e.key === 'Enter' && userInput !== '') {
                        this.store.dispatch({ type: 'ADD_ENTRY', entry: userInput });
                        this.textFieldObj.dom.querySelector('input').value = '';
                        this.menu.close();
                        this.textFieldObj.mdc.focus();
                    } else if (e.key === 'ArrowDown') {
                        const allMenuLi = this.menu.menuObj.dom.querySelectorAll('li');
                        if (allMenuLi.length !== 0) {
                            this.menu.menuObj.mdc.getDefaultFoundation()['adapter_'].focusItemAtIndex(0);
                            this.store.dispatch({
                                type: 'SET_INPUT',
                                userInput: allMenuLi[0].querySelector('span').textContent
                            });
                        }
                    } else if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        this.load_suggestions(userInput);
                        this.store.dispatch({ type: 'SET_INPUT', userInput });
                        setTimeout(() => this.textFieldObj.mdc.focus(), 600);

                    }
                })
            ).subscribe();

        // List items subscriber.
        this.store.subscribe(() => {
            const list = this.store.getState().list;
            if (list.entries.length > this.entriesLength) {
                this.entriesLength++;
                // Add the newly typed entry to the list.
                this.add_list_item(list.entries[list.entries.length - 1]);
            } else if (list.entries.length < this.entriesLength) {
                this.entriesLength--;
                // Remove the deleted entry from the list.
                this.remove_list_item(list.entryIndex);
            }
        });

        this.store.subscribe(() => {
            const input = this.store.getState().input;
            if (input.inputChanged === true) {
                this.textFieldObj.dom.querySelector('input').value = input.userInput;
                this.store.dispatch({ type: 'RESET_INPUT' });
            }
        });
        this.store.subscribe(() => {
            const input = this.store.getState().input;
            if (input.focusInput === true) {
                this.load_suggestions(input.userInput);
                setTimeout(() => this.textFieldObj.mdc.focus(), 600);
                this.store.dispatch({ type: 'RESET_INPUT' });
            }
        });

    }
}


window.addEventListener('load', _ => {
    new Index();
});

