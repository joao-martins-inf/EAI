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