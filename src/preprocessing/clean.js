/**
 * convert a text to lower case
 * @param input {string} text
 * @returns {string}
 */
const toLowerCase = (input) => {
    return input.toLowerCase();
}

/**
 * Receives a text and cleans white spaces in the beginning, in the end
 * and everywhere where there is more than 1 white space should be converted to
 * a single space
 * @param input {string} text
 * @returns {string}
 */
const trim = (input) => {
    return input.trim();
}

/**
 * Removes every numeric char or punctuation
 * @param input {string} text
 * @returns {string} cleaned text
 */
const removeSpecialCharactersAndNumbers = (input) => {
    return input.replace(/[^a-z ]/g, '');
}

/**
 * Applies every cleaning function
 * @param input {string} text
 * @returns {string}
 */
const cleanInput = (input) => {
    return trim(removeSpecialCharactersAndNumbers(toLowerCase(input)));
}

export default cleanInput;