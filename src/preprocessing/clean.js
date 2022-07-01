/**
 * @module clean
 */

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
    return input.trim().replace(/\s\s+/g, ' ');;
}


/**
 * Removes every numeric char or punctuation and twitter features
 * @param input {string} text
 * @returns {string} cleaned text
 */
const removeTweetFeatures = (input) => {
    return input.replace(/(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)/g, '')
}

/**
 * Applies every cleaning function
 * @param {string} input text
 * @returns {string}
 */
const cleanInput = (input) => {
    return trim(removeTweetFeatures(toLowerCase(input)));
}

export default cleanInput;