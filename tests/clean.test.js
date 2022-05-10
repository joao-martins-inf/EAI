import clean from '../src/preprocessing/clean.js';

describe('clean', () => {
    test('Applies every cleaning function', () => {
        expect(clean('  Success is  the PP2ower  . 2%')).toBe('success is the ppower');
    });
})
