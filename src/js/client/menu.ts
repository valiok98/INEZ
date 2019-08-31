import { MDCMenu } from '@material/menu';
import { Subject, from } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
/**
 * Suggestions menu component.
 */
export class Menu {

    public store: any;
    public menuObj: { dom: HTMLDivElement, mdc: MDCMenu };
    private suggSubject: any;

    constructor() {
        this.store = window.store;
        this.menuObj = {
            dom: document.querySelector('.mdc-menu'),
            mdc: new MDCMenu(document.querySelector('.mdc-menu'))
        };
        this.menuObj.mdc.getDefaultFoundation().init();
        this.suggSubject = new Subject();
        this.attach_handlers();
    }

    /**
     * Open the menu.
     */
    open() {
        if (this.menuObj.dom.querySelectorAll('li.mdc-list-item').length !== 0) {
            this.menuObj.mdc.open = true;
        }else {
            this.close();
        }
    }

    /**
     * Populate the menu component with entries.
     */
    populate_menu_entries(suggestions: string[]) {
        const prevLi = this.menuObj.dom.querySelectorAll('li.mdc-list-item');
        // Remove all previous menu entries.
        for (let prevIdx = 0; prevIdx < prevLi.length; prevIdx++) {
            prevLi[prevIdx].remove();
        }
        // Add all new menu entries.
        for (let suggIdx = 0; suggIdx < suggestions.length; suggIdx++) {
            const li: HTMLLIElement = document.createElement('li');
            li.classList.add('mdc-list-item');
            li.setAttribute('role', 'menuitem');
            li.setAttribute('tabindex', suggIdx === 0 ? '0' : '-1');
            li.innerHTML = `<span class="mdc-list-item__text">${suggestions[suggIdx]}</span>`;
            this.menuObj.dom.querySelector('ul.mdc-list').appendChild(li);
        }
        this.open();
    }

    /**
     * Close the menu.
     */
    close() {
        this.menuObj.mdc.open = false;
    }

    /**
     * Focus the menu.
     */
    focus() {
        const allLi = this.menuObj.dom.querySelectorAll('li.mdc-list-item');
        if (allLi.length > 0) {
            this.menuObj.mdc.getDefaultFoundation()['adapter_'].focusItemAtIndex(0);
        }
    }

    /**
     * All event handlers for component and store.
     */
    attach_handlers() {

        this.menuObj.dom.addEventListener('keyup', (e: KeyboardEvent) => {
            const target: EventTarget = e.target;
            const allMenuLi = this.menuObj.dom.querySelectorAll('li');
            if (target instanceof HTMLLIElement &&
                (e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    (e.key === 'ArrowUp' &&
                        allMenuLi.length !== 0 &&
                        target === allMenuLi[allMenuLi.length - 1]))) {
                this.store.dispatch({ type: 'FOCUS_INPUT' });
            }
            else if (target instanceof HTMLLIElement &&
                (e.key === 'ArrowUp' ||
                    e.key === 'ArrowDown')) {
                const newInput = (<HTMLLIElement>target).querySelector('span').textContent;
                this.store.dispatch({ type: 'SET_INPUT', userInput: newInput });
            }
            else if (e.key.match(/^[a-z]$|^[0-9]$/)) {
                const input = this.store.getState().input;
                this.store.dispatch({ type: 'SET_INPUT', userInput: input.userInput + e.key });
                this.store.dispatch({ type: 'FOCUS_INPUT' });
            } else if (e.key === 'Backspace') {

            }
        });

        this.menuObj.dom.addEventListener('MDCMenu:selected', (e: any) => {
            const li: HTMLLIElement = e.detail.item;
            // Emit the new user input event.
            this.close();
            // Keep the userInput value in sync.
            this.store.dispatch({ type: 'SET_INPUT', userInput: li.querySelector('span').textContent });
        });

        this.store.subscribe(() => {
            const menu = this.store.getState().menu;
            if (menu.suggestionsChanged === true) {
                this.suggSubject.next(menu.suggestions);
                // Reset the changed state of the input component.
                this.store.dispatch({ type: 'RESET_MENU' });
            }
        });

        from(this.suggSubject)
            .pipe(
                debounceTime(150),
                tap((suggestions: string[]) => this.populate_menu_entries(suggestions))
            ).subscribe();

    }

}