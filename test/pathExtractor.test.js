import { expect} from 'chai';

import pathExtractor from '../src/pathExtractor'

describe("pathExtractor", function() {
    it('it resolve single property', function () {
        expect(pathExtractor.resolve('name', {name:'Hello'})).to.eql('Hello');
    });

    it('it resolve single nested property', function () {
        expect(pathExtractor.resolve('user.name', {user:{name:'Hello'}})).to.eql('Hello');
    });

    it('it resolve single array property', function () {
        expect(pathExtractor.resolve('arr', {arr:[1,2,3]})).to.eql([1,2,3]);
    });

    it('it resolve single array object property with brackets', function () {
        expect(pathExtractor.resolve('arr[].name', {arr:[{name:'name1'}, { name: 'name2'}]})).to.eql(['name1', 'name2']);
    });

    it('it resolve single array second property with brackets', function () {
        expect(pathExtractor.resolve('arr[1].name', {arr:[{name:'name1'}, { name: 'name2'}]})).to.eql('name2');
    });

    it('it resolve first item in array', function () {
        expect(pathExtractor.resolve('arr[0]', {arr:[1,2,3]})).to.eql(1);
    });

    it('it resolve single array property with brackets', function () {
        expect(pathExtractor.resolve('arr[].child[].name', {arr:[{child:[{name:'name1'}, {name:'name2'}]}, { child:[{ name: 'name2_1'}]}]})).to.eql([['name1', 'name2'], ['name2_1']]);
    });
})