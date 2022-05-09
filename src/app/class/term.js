/**
 *
 */
export default class Term {

    /**
     *
     * @param name {string}
     * @param binary {number}
     * @param occurrences {number}
     * @param docId {number}
     * @param tf {number}
     * @param idf {number}
     * @param tfidf {number}
     * @param metric {number}
     */
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

    /**
     *
     */
    toString = () => {
        return this.name;
    }


    /**
     *
     * @param value {number}
     */
    setIdf = (value) => {
        this.idf = value;
    }

    /**
     *
     * @param value {number}
     */
    setTfIdf = (value) => {
        this.tfidf = value;
    }

    /**
     *
     * @param value {number}
     */
    setMetric = (value) => {
        this.metric = value;
    }

    /**
     *
     * @param value {number}
     */
    setBinary = (value) => {
        this.binary = value;
    }

    /**
     *
     * @param value {number}
     */
    setOccurrences = (value) => {
        this.occurrences = value;
    }

    /**
     *
     * @param value {number}
     */
    setTf = (value) => {
        this.tf = value;
    }
}