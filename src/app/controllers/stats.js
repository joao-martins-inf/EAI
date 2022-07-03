class statsController {
    async index(req, res) {
        const {limit, label} = req.query;
        //const docs = await corpus.getDocumentsByLabel(label.toString(), limit);
        const result = this.confusionMatrix();
        return res.json(docs);
    }

    /**
     *
     * @param Object array array with the predictedClass realClass and the doc
     */
    confusionMatrix = (prediction, real) => {
        //const prediction = ['woman', 'man', 'man', 'woman', 'man', 'woman'];
        //const real = ['woman', 'man', 'woman', 'woman', 'woman', 'woman'];

        if(prediction.length !== real.length) return;

        let distinctLabels;
            distinctLabels = new Set([...real, ...prediction]);

        distinctLabels = Array.from(distinctLabels);

        // Create confusion matrix and fill with 0's
        const matrix = Array.from({ length: distinctLabels.length });
        for (let i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(matrix.length);
            matrix[i].fill(0);
        }

        for (let i = 0; i < prediction.length; i++) {
            const actualIdx = distinctLabels.indexOf(real[i]);
            const predictedIdx = distinctLabels.indexOf(prediction[i]);
            if (actualIdx >= 0 && predictedIdx >= 0) {
                matrix[actualIdx][predictedIdx]++;
            }
        }
        return {matrix: matrix , labels: distinctLabels};
    }

    precision = (matrixObj) => {
        let matrix = matrixObj.matrix;
        let correct = 0;
        let incorrect = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (i === j) correct += matrix[i][j];
                else incorrect += matrix[i][j];
            }
        }
        return correct / (correct + incorrect);
    }

    getLabelClass = (mtx, label) => {
        let matrix = mtx.matrix;
        const pos = mtx.labels.findIndex(elem => elem === label);
        if(pos == -1) return null;

        const truePositive = matrix[pos][pos];
        const falsePositive = matrix[pos].reduce((prev, next) => prev + next) - truePositive;

        let falseNegative = 0;
        for (let i = 0; i < matrix.length ; i++) {
            falseNegative += matrix[i][pos];
        }

        falseNegative -= truePositive;

        let sumLabels = [];
        matrix.forEach(array => {
            array.forEach((value, index) => {
                sumLabels[index] += value;
            })
        });

        const sampleTotals = sumLabels.reduce((prev, next) => prev + next);

        const trueNegative = sampleTotals - falseNegative - falsePositive - truePositive;

        return {truePositive, trueNegative, falsePositive, falseNegative};
    }

    recall = (matrixObj)  => {
        const classesSum = {
            truePositive: 0,
            trueNegative: 0,
            falsePositive: 0,
            falseNegative: 0
        }

        let matrix = matrixObj.matrix;
        let labels = matrixObj.labels;

        labels.forEach(label => {
            classesSum.truePositive += this.getLabelClass(matrixObj, label).truePositive;
            classesSum.trueNegative += this.getLabelClass(matrixObj, label).trueNegative;
            classesSum.falsePositive += this.getLabelClass(matrixObj, label).falsePositive;
            classesSum.falseNegative += this.getLabelClass(matrixObj, label).falseNegative;
        });

        const { truePositive, falseNegative } = classesSum;
        const result = (truePositive) / (truePositive + falseNegative);
        return result || 0;
    }

    fMeasure = (precision, recall) => {
        return 2 * ((precision * recall) / (precision + recall)) || 0;
    }
}

export const StatsController = new statsController()