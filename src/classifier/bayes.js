import {train} from '../dal/train.js';
import {calculateProbability} from './bayes.js';

const getTrainingSetByClass = (label = null) => {
    const trainingSet = await train.getTrainingSet();

    if(label === null){
        return trainingSet;
    }

    return trainingSet.filter((c) => c.corpus_detail[0].label === label);

}

export const calculateProbability = (label) => {
    const trainingSet = await train.getTrainingSet();

    return getTrainingSetByClass(label).length / trainingSet.length;
}