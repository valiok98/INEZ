/**
 * The callback function that is triggered by dict.cc.
 * The userInput parameter can be ignored.
 * 
 * @param userInput{string}
 * @param suggestions{Array}
 */
function autosug_display_data(userInput, suggestions) {
    suggestions = suggestions
        .filter(sugg => sugg.trim().split('\t')[1] === '1')
        .map(sugg => sugg.trim().split('\t')[0]);
    window.store.dispatch({ type: 'ADD_SUGGESTIONS', suggestions })
}