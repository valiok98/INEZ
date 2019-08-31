import { createStore, combineReducers, bindActionCreators } from 'redux';

declare global {
    interface Window {
        store: any
    }
}

interface action {
    type: string;
    inputChanged: boolean;
    userInput: string;
    focusInput: boolean;
    suggestionsChanged: boolean;
    suggestions: string[];
    entry: string;
    entryIndex: number;
}

const initialState: object = {
    input: { inputChanged: false, userInput: '', focusInput: true },
    list: { entries: [], entryIndex: -1 },
    menu: { suggestionsChanged: false, suggestions: [] }
};

const reducers = {
    input: (state: any = {}, action: action): any => {
        switch (action.type) {
            case 'SET_INPUT':
                return {
                    ...state,
                    userInput: action.userInput,
                    inputChanged: true
                };
            case 'FOCUS_INPUT':
                return {
                    ...state,
                    focusInput: true,
                };
            case 'RESET_INPUT':
                return {
                    ...state,
                    inputChanged: false,
                    focusInput: false
                };
            default:
                return state;
        }
    },
    menu: (state: any = {}, action: action): any => {
        switch (action.type) {
            case 'ADD_SUGGESTIONS':
                return {
                    ...state,
                    suggestions: action.suggestions,
                    suggestionsChanged: true
                };
            case 'RESET_MENU':
                return {
                    ...state,
                    suggestionsChanged: false
                };
            default:
                return state;
        }
    },
    list: (state: any = {}, action: action): any => {
        switch (action.type) {
            case 'ADD_ENTRY':
                return {
                    ...state,
                    entries: [...state.entries, action.entry]
                };
            case 'REMOVE_ENTRY':
                return {
                    entries: state.entries.filter((_: any, eIndex: number) => eIndex !== action.entryIndex),
                    entryIndex: action.entryIndex
                };
            default:
                return state;
        }
    }
};

const reducer = combineReducers(reducers);
window.store = createStore(reducer, initialState);