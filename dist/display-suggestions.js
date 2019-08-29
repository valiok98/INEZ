/**
 *
 * @param userInput{string}
 * @param suggestions{Array}
 */
function autosug_display_data(userInput, suggestions) {
    suggestions = suggestions.map(sugg => sugg.trim().substr(0, sugg.indexOf(' ')));
    window.store.dispatch({type: 'ADD_SUGGESTION', inputChanged: true, userInput, suggestions})
}