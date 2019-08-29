import {MDCMenu} from '@material/menu';
/**
 * Suggestions menu component.
 */
export class Menu {

    private store: any;
    private menuObj: { dom: HTMLDivElement, mdc: MDCMenu };


    constructor() {
        this.store = window.store;
        this.menuObj = {
            dom: document.querySelector('.mdc-menu'),
            mdc: new MDCMenu(document.querySelector('.mdc-menu'))
        };
        this.menuObj.mdc.getDefaultFoundation().init();
        this.set_fixed_position(false);
        this.attach_handlers();
    }

    /**
     * Open the menu.
     */
    open() {
        this.menuObj.mdc.open = true;
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
            li.innerHTML = `<span class = "mdc-list-item__text" >${suggestions[suggIdx]}</span>`;
            this.menuObj.dom.appendChild(li);
        }
    }

    /**
     * Close the menu.
     */
    close() {
        this.menuObj.mdc.open = false;
    }

    /**
     * Set whether the menu's position should be fixed.
     * @param value{booloean}
     */
    set_fixed_position(value: boolean) {
        this.menuObj.mdc.setFixedPosition(value);
    }

    /**
     * All event handlers for component and store.
     */
    attach_handlers() {
        this.store.subscribe(() => {
            const input = this.store.getState().input;
            if (input.inputChanged === true) {
                this.populate_menu_entries(input.suggestions);
                // Reset the changed state of the input component.
                this.store.dispatch({type: 'RESET_CHANGED'});
            }
        });
    }

}