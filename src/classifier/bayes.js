import {train} from '../dal/train.js';

const getTrainingSetByClass = async (label = null) => {
    const trainingSet = await train.getTrainingSet();

    if(label === null){
        return trainingSet;
    }

    return trainingSet.filter((c) => c.corpus_detail[0].label === label);

}

export const calculateProbability = async (label) => {
    const trainingSet = await train.getTrainingSet();

    return getTrainingSetByClass(label).length / trainingSet.length;
}