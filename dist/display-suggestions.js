/**
 *
 * @param userInput{string}
 * @param suggestions{Array}
 */
function autosug_display_data(userInput, suggestions) {
    var exp = suggestions;
    suggestions = suggestions
        .filter(sugg => sugg.trim().split('\t')[1] === '1')
        .map(sugg => sugg.trim().split('\t')[0]);
    window.store.dispatch({type: 'ADD_SUGGESTION', inputChanged: true, userInput, suggestions})
}