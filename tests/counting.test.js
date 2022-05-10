import {idf, numberOfOccurrences, characters,exists, tf, tfidf, words} from '../src/preprocessing/counting.js'

describe('counting', () => {
    test('numberOfOccurences with 2 occurences', () => {
        expect(numberOfOccurrences('test', 'this should test show only test 2 timetests')).toBe(2)
    });

    test('numberOfOccurences with no occurences', () => {
        expect(numberOfOccurrences('test', 'this should show only 2 timetess')).toBe(0)
    })

    //test('numberOfOccurences with bigrams occurences', () => {
    //    expect(numberOfOccurrences('should show', 'this should show only 2 timetess')).toBe(1)
    //})
})