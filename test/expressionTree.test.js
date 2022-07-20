import chai from 'chai';
const {expect} = chai;

import ExpressionTreeEvaluator from '../src/expression/expressionTreeEvaluator.js';
import simpleJsulator from "../src/simpleJsulator.js";


describe("expressionTree", function () {
  let jsulator, exprTree;
  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
    exprTree = new ExpressionTreeEvaluator(jsulator);
  });

  it('test', function () {
    expect(
      exprTree.fromString('{')
    ).to.not.eql(null);
  });

});
