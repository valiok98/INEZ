import {MDCMenu} from '@material/menu';

/**
 * Suggestions menu component.
 */
export class Menu {

    private store: any;
    private obj: MDCMenu;


    constructor() {
        this.store = window.store;
        this.obj = new MDCMenu(document.querySelector('.mdc-menu'));
        this.set_fixed_position(false);
        this.attach_handlers();
    }

    /**
     * Open the menu.
     */
    open() {
        this.obj.open = true;
    }

    add_menu_entry(){

    }

    remove_menu_entry() {

    }

    /**
     * Close the menu.
     */
    close() {
        this.obj.open = false;
    }

    /**
     * Set whether the menu's position should be fixed.
     * @param value{booloean}
     */
    set_fixed_position(value: boolean) {
        this.obj.setFixedPosition(value);
    }

    /**
     * All event handlers for component and store.
     */
    attach_handlers() {
        this.store.subscribe(() => {
            const input = this.store.getState().input;
            if (input.inputChanged === true) {

                // Reset the changed state of the input component.
                this.store.dispatch({type: 'RESET_CHANGED'});
            }
        });
    }

}