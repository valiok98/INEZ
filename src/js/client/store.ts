import { createStore, combineReducers } from 'redux';

interface action {
    type: string;
    entry: string;
    entryIndex: number;
}

const initialState: object = {
    entries: { values: [], entryIndex: -1 },
};

const reducers = {
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
    },
};

const reducer = combineReducers(reducers);
export const store = createStore(reducer, initialState);