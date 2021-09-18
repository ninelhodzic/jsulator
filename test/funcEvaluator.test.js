import {expect} from 'chai';
//import simpleJsulator, {tokenizer} from '../src'
import simpleJsulator from "../src/simpleJsulator";


describe("function", function () {
  let jsulator;
  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
  });

  it('evaluate simple function string', function () {
    const expr = "FUNC('# return context.list #')";
    expect(
      jsulator.evaluate(expr, { list: [1, 2, 3]})
    ).to.eql([1,2,3]);
  });

  it('evaluate simple function call', function () {
    const expr = "FUNC('# const c = function(ctx){ return ctx.list; }; return c(context); #')";
    expect(
      jsulator.evaluate(expr, { list: [1, 2, 3]})
    ).to.eql([1,2,3]);
  });

  it('evaluate simple STEP call', function () {
    const expr = "STEP(THIS()'#$_current.list$#')";
    expect(
      jsulator.evaluate(expr, { list: [1, 2, 3]})
    ).to.eql([1,2,3]);
  });

  it('evaluate simple STEP 2 call ', function () {
    const expr = "STEP(THIS()'#EXTEND($_current$, FIELD('ops', '123')) #', '#$_current$#')";
    expect(
      jsulator.evaluate(expr, { list: [1, 2, 3]})
    ).to.eql({list: [1, 2, 3], ops: '123'});
  });

  it('evaluate simple STEP 3 call ', function () {
    const expr = "STEP(THIS()'#FIELD('str', 'this')#', '#FIELD('str', $_current.str$+' is ')#', '#FIELD('str', $_current.str$+'string')#', '#$_current.str$#')";
    expect(
      jsulator.evaluate(expr, { list: [1, 2, 3]})
    ).to.eql('this is string');
  });
});
