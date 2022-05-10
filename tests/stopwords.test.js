import stopwords from "../src/preprocessing/stopwords.js";

describe('stopwords', () => {
    test('Should remove stop words',()=> {
        expect(stopwords('the test is that we got every word'.split(' '))).toEqual(['test' ,'every' ,'word']);
    })
})