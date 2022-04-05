import { nGram } from 'n-gram';

const ngram = (input, n) => {
    return nGram(n)(input);
}

export default ngram;
//module.exports = ngram;