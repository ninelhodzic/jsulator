import {expect} from 'chai';
import simpleJsulator from "../src/simpleJsulator";

const functions = {
  TEST: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands;
    }
  },
  TEST1:{
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0] +'-TEST-'+operands[1];
    }
  }
}

describe("extendtest", function () {
  let jsulator;
  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
    simpleJsulator.buildExtend({functions: functions});
  });

  it('run extend function TEST', function () {
    const expression = "TEST('test')";
    expect(
      jsulator.evaluate(expression, {})
    ).to.not.eql('test');
  });
  it('run extend function TEST1', function () {
    const expression = "TEST('abc', 'cba')";
    expect(
      jsulator.evaluate(expression, {})
    ).to.not.eql('abc-TEST-cba');
  });

});
