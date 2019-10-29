import parameters from './parameters'
import javulator from './javulator'
import mapResolver from './mapResolver'
import operators from './methods/operators'
import functions from './methods/functions'

const params = {
    build(){
        for(const prop in operators){
            const operator = operators[prop];
            parameters.addOp(prop, operator.symbol, operator.operandCount, operator.associativity, operator.precedence, operator.fn);
        }
        for(const prop in functions){
            const func = functions[prop];
            parameters.addFn(prop, func.minArgumentCount, func.maxArgumentCount, func.fn);
        }
        return parameters;
    }
}

const simpleJavulator = {
    javulator: null,
    init() {
        const paramBuild = params.build();
        const paramArray = paramBuild.getParameters();
        this.javulator = javulator.javulator(paramArray, mapResolver);
    },
    simpleJavulator() {
        this.init();
        return this;
    },
    evaluate(expression, context){
        return this.javulator.evaluate(expression, context);
    }
};

export default simpleJavulator;