import {train} from '../dal/train.js';

const getTrainingSetByClass = (trainingSet, label = null) => {
    if(label === null){
        return trainingSet;
    }

    return trainingSet.filter((c) => c.label === label);

}

export const calculateProbability = async (label) => {
    const trainingSet = await train.getTrainingSet();
    const a = getTrainingSetByClass(trainingSet, label).length;
    const b = trainingSet.length;

    return a / b;
}

/**
 * @param {Term[]} tokens array of words
 * @returns {null}
 */
export const frequencyTable = (tokens) => {
    var frequencyTable = Object.create(null)

    tokens.forEach(token => {
        if (!frequencyTable[token.name])
            frequencyTable[token.name] = 1
        else
            frequencyTable[token.name]++
    })

    return frequencyTable
}