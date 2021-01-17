import parameters from './parameters'
import jsulator from './jsulator'
import mapResolver from './mapResolver'
import operators from './methods/operators'
import functions from './methods/functions'

const params = {
  _buildOperators(operators){
    for (const prop in operators) {
      const operator = operators[prop];
      parameters.addOp(prop, operator.symbol, operator.operandCount, operator.associativity, operator.precedence, operator.fn);
    }
  },
  _buildFunctions(functions){
    for (const prop in functions) {
      const func = functions[prop];
      parameters.addFn(prop, func.minArgumentCount, func.maxArgumentCount, func.fn);
    }
  },
  build(extend) {
    this._buildOperators(operators);
    this._buildFunctions(functions);

    if (extend){
      if (extend.operators){
        this._buildOperators(extend.operators);
      }
      if (extend.functions){
        this._buildFunctions(extend.functions);
      }
    }
    return parameters;
  }
};

const simpleJsulator = {
  jsulator: null,
  _init(extend) {
    const paramBuild = params.build(extend);
    const paramArray = paramBuild.getParameters();
    this.jsulator = jsulator.jsulator(paramArray, mapResolver);
  },
  simpleJsulator(extend) {
    this._init(extend);
    return this;
  },
  evaluate(expression, context) {
    return this.jsulator.evaluate(expression, context);
  }
};

export default simpleJsulator;
