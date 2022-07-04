export default class Term {

    /**
     * @constructs Term
     * @param name {string} term
     * @param binary {number} if exists or not in the docId
     * @param occurrences {number} how many times occurred in every doc
     * @param docId {number} document id
     * @param tf {number}
     * @param idf {number}
     * @param tfidf {number}
     * @param metric {?number}
     */
    constructor(name, binary, occurrences, docId, tf = 0, idf = 0, tfidf = 0, metric = null) {
        this._name = name;
        this._binary = binary;
        this._occurrences = occurrences;
        this._docId = docId;
        this._tf = tf;
        this._idf = idf;
        this._tfidf = tfidf;
        this._metric = metric;
    }

    clone = (term) => {
        return new Term(this._name, this._binary, this._occurrences, this._docId, this._tf, this._idf, this._tfidf, this._metric);
    }

    /**
     * @memberOf Term
     * @method
     */
    toString = () => {
        return this._name;
    }


    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setIdf = (value) => {
        this._idf = value;
    }

    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setTfIdf = (value) => {
        this._tfidf = value;
    }

    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setMetric = (value) => {
        this._metric = value;
    }

    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setBinary = (value) => {
        this._binary = value;
    }

    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setOccurrences = (value) => {
        this._occurrences = value;
    }

    /**
     * @memberOf Term
     * @method
     * @param value {number}
     */
    setTf = (value) => {
        this._tf = value;
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     *
     * @returns {number}
     */
    get binary() {
        return this._binary;
    }

    /**
     *
     * @returns {number}
     */
    get occurrences() {
        return this._occurrences;
    }

    /**
     *
     * @returns {number}
     */
    get docId() {
        return this._docId;
    }

    /**
     *
     * @returns {number}
     */
    get tf() {
        return this._tf;
    }

    /**
     *
     * @returns {number}
     */
    get idf() {
        return this._idf;
    }

    /**
     *
     * @returns {number}
     */
    get tfidf() {
        return this._tfidf;
    }

    /**
     *
     * @returns {?number}
     */
    get metric() {
        return this._metric;
    }

    showTf = () => {
       return {
           text: this._name,
           value: this._tf
       }
    }

    showOcc = () => {
        return {
            text: this._name,
            value: this._occurrences
        }
    }
}