import { expect} from 'chai';

import pathExtractor from '../src/pathExtractor'

describe("pathExtractor", function() {
    it('it resolve single property', function () {
        expect(pathExtractor.resolve('name', {name:'Hello'})).to.eql('Hello');
    });

    it('it resolve nothing on nothing', function () {
        expect(pathExtractor.resolve('', {user:{name:'Hello'}})).to.eql('');
    });

    it('it resolve undefined on single number', function () {
        expect(pathExtractor.resolve('1', {user:{name:'Hello'}})).to.eql(undefined);
    });

    it('it resolve space string on space string', function () {
        expect(pathExtractor.resolve(' ', {user:{name:'Hello'}})).to.eql('');
    });

    it('it resolve undefined on empty brackets', function () {
        expect(pathExtractor.resolve('{}', {user:{name:'Hello'}})).to.eql(undefined);
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

    it('it remove single property', function () {
        expect(pathExtractor.remove('name', {name:'Hello'})).to.eql({});
    });

    it('it remove child property', function () {
        expect(pathExtractor.remove('user.name', { user: {name:'Hello', age:23} })).to.eql({user:{age:23}});
    });

    it('it remove single array property', function () {
        expect(pathExtractor.remove('arr[]', {arr:[1,2,3]})).to.eql({});
    });
    it('it remove first item in array', function () {
        expect(pathExtractor.remove('arr[0]', {arr:[1,2,3]})).to.eql([2,3]);
    });

    it('it removes property from second item in the array', function () {
        expect(pathExtractor.remove('arr[1].name', {arr:[{name:'name1'}, { name: 'name2'}]})).to.eql({arr:[{name:'name1'},{}]});
    });

/*    it('it updates simple', function () {
        expect(pathExtractor.put({message:'Hello'}, 'message', 'New' )).to.eql('New');
    });*/

    it('it updates first item in array', function () {
        expect(pathExtractor.put({arr:[1,2,3]}, 'arr[0]',10 )).to.eql({arr:[10, 2,3]});
    });

 /*   it('it updates first item in child array', function () {
        expect(pathExtractor.put({arr:[{child:[{name:'Ovo bilo'}]},2,3]}, 'arr[0].child[].name',10 )).to.eql({arr:[{child:[{name:10}]},2,3]});
    });*/
})