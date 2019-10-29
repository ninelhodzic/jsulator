import { expect} from 'chai';

import simpleJsulator, {tokenizer} from '../src'


describe("tokenizer", function() {
    var tokeniser;
    before(function () {
        tokeniser = tokenizer.tokenizer(['(', ')', '+', '!']);
    });
    it('it tokenize', function () {
        expect(tokeniser.tokenize('5+4+3')).to.eql(['5','+','4','+','3']);
    });
});

describe("simpleJsulator", function () {
    var jsulator;

    before(function () {
      jsulator = simpleJsulator.simpleJsulator();
    });

    it('returns an mapResolver', function () {
        expect(jsulator.jsulator.mapResolver).to.not.eql(null);
    });

    it('returns an sum', function () {
        expect(jsulator.evaluate('2+2')).to.eql(4);
    });

    it('returns not true', function () {
        expect(jsulator.evaluate('!true')).to.eql(false);
    });
    it('returns from context', function () {
        expect(jsulator.evaluate("$message$+' World'", {message:'Hello'})).to.eql('Hello World');
    });

    it('returns sum from context', function () {
        expect(jsulator.evaluate("$a$+$b$", {a: 10, b:20})).to.eql(30);
    });

    it('returns greater from context', function () {
        expect(jsulator.evaluate("$a$>$b$", {a: 30, b:20})).to.eql(true);
    });

    it('returns FIELD from context', function () {
        expect(jsulator.evaluate("FIELD('key', 34+1)")).to.eql({key: 35});
    });

    it('returns MAP FIELD from context', function () {
        expect(jsulator.evaluate("MAP(FIELD('key', $kk$+1), FIELD('key1', $kk$))", {kk:89})).to.eql({key: 90, key1:89});
    });

    it('returns SIZE_OF from context', function () {
        expect(jsulator.evaluate("SIZE_OF($v$)",  { v:['1','2','3']})).to.eql(3);
    });

    it('returns IS_NULL from context', function () {
        expect(jsulator.evaluate("IS_NULL($v$)",  { v:['1','2','3']})).to.eql(false);
    });

    it('returns SET_NULL from context', function () {
        expect(jsulator.evaluate("SET_NULL()")).to.eql(null);
    });
    it('returns THIS from context', function () {
        expect(jsulator.evaluate("THIS()",  { v:['1','2','3']})).to.eql({v:['1','2','3']});
    });

    it('returns IF from context', function () {
        expect(jsulator.evaluate("IF(2>3,4,5)")).to.eql(5);
    });

    it('returns TO_BOOLEAN from context', function () {
        expect(jsulator.evaluate("TO_BOOLEAN(5)")).to.eql(true);
    });

    it('returns EXTEND from context', function () {
        expect(jsulator.evaluate("FIELD('obj', EXTEND($obj$, FIELD('key', 1), FIELD('key2', 2)))", { obj:{name:'obj', arr:[1,2,3]}})).to.eql({ obj:{key:1, key2: 2, name:'obj', arr:[1,2,3]}});
    });


});
