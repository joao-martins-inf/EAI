import { Stats } from 'fs';
import {cosineSimilarity} from '../../classifier/classifier.js'
import {test} from '../../dal/test.js'
import {StatsController} from '../controllers/stats.js'

class testController {

    async classify(testingSet) {
        const arr = [];
        for (let row in testingSet) {
            const similarity = await cosineSimilarity(testingSet[row].text)
            arr.push(similarity.prediction);
        }

        return arr;
    }

    async classifyTestSet() {
        const testingSet = await test.getTestingSet();
        const arrPrediction = await this.classify(testingSet);
        const arrReal = testingSet.map((row) => row.airline_sentiment);

        const prediction = ['woman', 'man', 'man', 'woman', 'man', 'woman'];
        const real = ['woman', 'man', 'woman', 'woman', 'woman', 'woman'];

        const confusionMatrix = StatsController.confusionMatrix(arrPrediction, arrReal);
        const precision = StatsController.precision(confusionMatrix)
        const recall = StatsController.recall(confusionMatrix)
        const fMeasure = StatsController.fMeasure(precision, recall)

        return {
            arrPrediction,
            arrReal,
            stats: {
                confusionMatrix,
                precision,
                recall,
                fMeasure
            }
        }
    }
}

export const TestController = new testController()