import { createStore, combineReducers } from 'redux';

const reducers = {
    add_comment: comment => {

    },
    remove_comment: comment => {
        
    }
};

const reducer = combineReducers(reducers);
export const store = createStore(reducer);