const clean = require('./clean');
const tokenization = require('./tokenization');
const { stemmerWithNgram, stemmerWithSplit } = require('./stemming');

const index = (text, number) => {
    const cleanedText = clean(text);
    console.log('cleanedText', cleanedText);
    const stemmedText = stemmerWithSplit(cleanedText);
    console.log('stemmedText', stemmedText);
    const result = tokenization(stemmedText, number);
    console.log('result', result);

    return result;
};

module.export = index;