import {MDCMenu} from '@material/menu';

/**
 * Suggestions menu component.
 */
export class Menu {

    private store: any;
    private obj: MDCMenu;


    constructor(store: any) {
        this.store = store;
        this.obj = new MDCMenu(document.querySelector('.mdc-menu'));
        this.set_fixed_position(false);
    }

    /**
     * Open the menu.
     */
    open() {
        this.obj.open = true;
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

}