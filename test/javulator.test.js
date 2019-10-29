import { expect} from 'chai';

import simpleJavulator, {tokenizer} from '../src'


describe("tokenizer", function() {
    var tokeniser;
    before(function () {
        tokeniser = tokenizer.tokenizer(['(', ')', '+', '!']);
    });
    it('it tokenize', function () {
        expect(tokeniser.tokenize('5+4+3')).to.eql(['5','+','4','+','3']);
    });
});

describe("simpleJavulator", function () {
    var javulator;

    before(function () {
        javulator = simpleJavulator.simpleJavulator();
    });

    it('returns an mapResolver', function () {
        expect(javulator.javulator.mapResolver).to.not.eql(null);
    });

    it('returns an sum', function () {
        expect(javulator.evaluate('2+2')).to.eql(4);
    });

    it('returns not true', function () {
        expect(javulator.evaluate('!true')).to.eql(false);
    });
    it('returns from context', function () {
        expect(javulator.evaluate("$message$+' World'", {message:'Hello'})).to.eql('Hello World');
    });

    it('returns sum from context', function () {
        expect(javulator.evaluate("$a$+$b$", {a: 10, b:20})).to.eql(30);
    });

    it('returns greater from context', function () {
        expect(javulator.evaluate("$a$>$b$", {a: 30, b:20})).to.eql(true);
    });

    it('returns FIELD from context', function () {
        expect(javulator.evaluate("FIELD('key', 34+1)")).to.eql({key: 35});
    });

    it('returns MAP FIELD from context', function () {
        expect(javulator.evaluate("MAP(FIELD('key', $kk$+1), FIELD('key1', $kk$))", {kk:89})).to.eql({key: 90, key1:89});
    });

    it('returns SIZE_OF from context', function () {
        expect(javulator.evaluate("SIZE_OF($v$)",  { v:['1','2','3']})).to.eql(3);
    });

    it('returns IS_NULL from context', function () {
        expect(javulator.evaluate("IS_NULL($v$)",  { v:['1','2','3']})).to.eql(false);
    });

    it('returns SET_NULL from context', function () {
        expect(javulator.evaluate("SET_NULL()")).to.eql(null);
    });
    it('returns THIS from context', function () {
        expect(javulator.evaluate("THIS()",  { v:['1','2','3']})).to.eql({v:['1','2','3']});
    });

    it('returns IF from context', function () {
        expect(javulator.evaluate("IF(2>3,4,5)")).to.eql(5);
    });

    it('returns TO_BOOLEAN from context', function () {
        expect(javulator.evaluate("TO_BOOLEAN(5)")).to.eql(true);
    });


});