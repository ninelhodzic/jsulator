import chai from 'chai';
const {expect} = chai;
//import simpleJsulator, {tokenizer} from '../src'
import simpleJsulator from "../src/simpleJsulator.js";


describe("function", function () {
  let jsulator;
  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
  });

  it('evaluate flatten', function () {
    const expr = "FLATTEN(THIS())";
    expect(
      jsulator.evaluate(expr, { id:'123', child:[{ name: 'NN', age: 10}, {name: 'BB', age: 11 }] })
    ).to.eql([{id: '123', child_name: 'NN', child_age: 10}, { id: '123', child_name: 'BB', child_age: 11}]);
  });

  it('evaluate forEach', function () {
    const expr = "FOREACH($child$, '# $_current$ #')";
    expect(
      jsulator.evaluate(expr, { id:'123', child:[{ name: 'NN', age: 10}, {name: 'BB', age: 11 }] })
    ).to.eql([{ name: 'NN', age: 10}, {name: 'BB', age: 11 }]);
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
