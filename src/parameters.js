
const parameters = {
    operators:[],
    functions:[],
    constants:[],
    addOp(name, symbol, operandCount, associativity, precedence, fn){
        const op = {
            type: 'OP',
            name: name,
            symbol: symbol,
            operandCount: operandCount,
            associativity: associativity,
            precedence: precedence,
            fn: fn
        };
       // console.log('operator', op);
        this.operators.push(op);
    },
    addFn(name,minArgumentCount, maxArgumentCount, fn){
        const func = {
           type: 'FN', name: name, minArgumentCount:minArgumentCount, maxArgumentCount:maxArgumentCount, fn: fn
        }
        this.functions.push(func);
    },
    addCs(name, symbol, value){
        const cs = {
           type: 'CS', name: name, symbol:symbol, value:value
        }
        this.constants.push(cs);
    },
    getParameters(){
        return this.operators.concat(this.functions).concat(this.constants);
    }
}


export default parameters
