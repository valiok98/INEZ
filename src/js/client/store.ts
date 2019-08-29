import {createStore, combineReducers, bindActionCreators} from 'redux';

declare global {
    interface Window {
        store: any
    }
}

interface action {
    type: string;
    entry: string;
    entryIndex: number;
    inputChanged: false;
    userInput: string;
    suggestions: string[];
}

const initialState: object = {
    input: {inputChanged: false, userInput: '', suggestions: []},
    entries: {values: [], entryIndex: -1},
};

const reducers = {
    input: (state: any = {}, action: action): any => {
        switch (action.type) {
            case 'ADD_SUGGESTION':
                return {
                    ...state,
                    inputChanged: true,
                    userInput: action.userInput,
                    suggestions: action.suggestions
                };
            case 'RESET_CHANGED':
                return {
                    ...state,
                    inputChanged: false
                };
            default:
                return state;
        }
    },
    entries: (state: any = {}, action: action): any => {
        switch (action.type) {
            case 'ADD_ENTRY':
                return {
                    ...state,
                    values: [...state.values, action.entry]
                };
            case 'REMOVE_ENTRY':
                return {
                    values: state.values.filter((_: any, eIndex: number) => eIndex !== action.entryIndex),
                    entryIndex: action.entryIndex
                };
            default:
                return state;
        }
    }
};

const reducer = combineReducers(reducers);
window.store = createStore(reducer, initialState);