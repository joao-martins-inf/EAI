import clean from './clean.js';
import tokenization from './tokenization.js';
import removeStopwords from './stopwords.js';
import { stemmerWithNgram, stemmerWithSplit} from './stemming.js';
import { addUniqueTerms } from '../features/bagOfWords';

const index = (text, number) => {
    const stopwordsRemoved = removeStopwords(text.split(' '));
    const cleanedText = clean(stopwordsRemoved.join(' '));
    const stemmedText = stemmerWithSplit(cleanedText);
    const tokenizedText = tokenization(stemmedText, number);

    const result = [];
    addUniqueTerms(result, tokenizedText); 

    return result;
};

module.export = index;