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

    it('returns MAP from context', function () {
        expect(javulator.evaluate("FIELD('key', 34)")).to.eql({key: 34});
    });
});