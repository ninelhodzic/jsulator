import parameters from './parameters'
import jsulator from './jsulator'
import mapResolver from './mapResolver'
import operators from './methods/operators'
import functions from './methods/functions'

const params = {
  build() {
    for (const prop in operators) {
      const operator = operators[prop];
      parameters.addOp(prop, operator.symbol, operator.operandCount, operator.associativity, operator.precedence, operator.fn);
    }
    for (const prop in functions) {
      const func = functions[prop];
      parameters.addFn(prop, func.minArgumentCount, func.maxArgumentCount, func.fn);
    }
    return parameters;
  }
};

const simpleJsulator = {
  jsulator: null,
  init() {
    const paramBuild = params.build();
    const paramArray = paramBuild.getParameters();
    this.jsulator = jsulator.jsulator(paramArray, mapResolver);
  },
  simpleJsulator() {
    this.init();
    return this;
  },
  evaluate(expression, context) {
    return this.jsulator.evaluate(expression, context);
  }
};

export default simpleJsulator;
