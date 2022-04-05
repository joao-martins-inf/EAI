import clean from './clean.js';
import tokenization from './tokenization.js';
import { stemmerWithNgram, stemmerWithSplit} from './stemming.js';

const index = (text, number) => {
    // remove stopword
    const cleanedText = clean(text);
    const stemmedText = stemmerWithSplit(cleanedText);
    const result = tokenization(stemmedText, number);

    return result;
};

export default index;
//module.export = index;