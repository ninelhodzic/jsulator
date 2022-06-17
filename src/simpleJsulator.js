import Parameters from './parameters.js'
import jsulator from './jsulator.js'
import mapResolver from './mapResolver.js'
import operators from './methods/operators.js'
import functions from './methods/functions.js'

class Params {
  constructor() {
    this.parameters = new Parameters();
  }

  _buildOperators(operators){
    for (const prop in operators) {
      const operator = operators[prop];
      this.parameters.addOp(prop, operator.symbol, operator.operandCount, operator.associativity, operator.precedence, operator.fn);
    }
  }

  _buildFunctions(functions){
    for (const prop in functions) {
      const func = functions[prop];
      this.parameters.addFn(prop, func.minArgumentCount, func.maxArgumentCount, func.fn);
    }
  }

  build(extend) {
    this._buildOperators(operators);
    this._buildFunctions(functions);
    this.buildExtend(extend);
    return this.parameters;
  }

  buildExtend(extend){

    if (extend){
      if (extend.operators){
        this._buildOperators(extend.operators);
      }
      if (extend.functions){
        this._buildFunctions(extend.functions);
      }
    }
    return this.parameters;
  }
};

const simpleJsulator = {
  jsulator: null,
  _init(extend) {
    const params = new Params();
    const paramBuild = params.build(extend);
    const paramArray = paramBuild.getParameters();
    this.jsulator = jsulator.jsulator(paramArray, mapResolver);
  },
  buildExtend(extend){
    const params = new Params();
    const paramBuild = params.buildExtend(extend);

    this.jsulator.appendParameters(paramBuild.getParameters());
    return this;
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
