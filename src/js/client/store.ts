// import { createStore, combineReducers } from 'redux';

// const initialState: any = {
//     (comments: string[]): []
// };

// const reducers = {
//     comments: (state: any = [], action: object) => {
//         switch (action.type) {
//             case 'ADD_COMMENT':
//                 return [
//                     ...state,
//                     action.comment
//                 ];
//             case 'REMOVE_COMMENT':
//                 return state.filter((_, cIndex) => cIndex !== action.commentIndex);
//             default:
//                 return state;
//         }
//     },
// };

// const reducer = combineReducers(reducers);
// export const store = createStore(reducer, initialState);