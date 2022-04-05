//const clean = require('./clean');
import clean from './clean.js';
//const tokenization = require('./tokenization');
import tokenization from './tokenization.js';
//const { stemmerWithNgram, stemmerWithSplit } = require('./stemming');
import { stemmerWithNgram, stemmerWithSplit} from './stemming.js';

const index = (text, number) => {
    const cleanedText = clean(text);
    console.log('cleanedText', cleanedText);
    const stemmedText = stemmerWithSplit(cleanedText);
    console.log('stemmedText', stemmedText);
    const result = tokenization(stemmedText, number);
    console.log('result', result);

    return result;
};

export default index;
//module.export = index;