export default class Term {

    constructor(name, binary, occurrences, docId, tf = 0, idf = 0, tfidf = 0, metric = null) {
        this.name = name;
        this.binary = binary;
        this.occurrences = occurrences;
        this.docId = docId;
        this.tf = tf;
        this.idf = idf;
        this.tfidf = tfidf;
        this.metric = metric;
    }


    setIdf = (value) => {
        this.idf = value;
    }

    setTfIdf = (value) => {
        this.tfidf = value;
    }

    setMetric = (value) => {
        this.metric = value;
    }

    setBinary = (value) => {
        this.binary = value;
    }

    setOccurrences = (value) => {
        this.occurrences = value;
    }

    setTf = (value) => {
        this.tf = value;
    }
}