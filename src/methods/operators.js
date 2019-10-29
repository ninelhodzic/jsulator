const operators = {
    NEGATE:{
        symbol: '!', operandCount: 1, associativity: 'RIGHT', precedence: 1,
        fn: function(operands, evaluationContext){
            if (operands && operands[0]){
                return !operands[0];
            }
            return false;
        }
    },
    AND:{
        symbol: '&&', operandCount: 2, associativity: 'LEFT', precedence: 2,
        fn: function(operands, evaluationContext){ return operands[0] && operands[1]; }
    },
    OR:{
        symbol: '||', operandCount: 2, associativity: 'LEFT', precedence: 3,
        fn: function(operands, evaluationContext){ return operands[0] || operands[1]; }
    },
    NOT_EQUAL:{
        symbol: '!=', operandCount: 2, associativity: 'LEFT', precedence: 4,
        fn: function(operands, evaluationContext){ return operands[0] !== operands[1]; }
    },
    EQUAL:{
        symbol: '==', operandCount: 2, associativity: 'LEFT', precedence: 5,
        fn: function(operands, evaluationContext){ return operands[0] === operands[1]; }
    },
    GREATER_THEN:{
        symbol: '>', operandCount: 2, associativity: 'LEFT', precedence: 6,
        fn: function(operands, evaluationContext){ return operands[0] > operands[1]; }
    },
    GREATER_THEN_OR_EQUAL:{
        symbol: '>=', operandCount: 2, associativity: 'LEFT', precedence: 7,
        fn: function(operands, evaluationContext){ return operands[0] >= operands[1]; }
    },
    LOWER_THEN:{
        symbol: '<', operandCount: 2, associativity: 'LEFT', precedence: 8,
        fn: function(operands, evaluationContext){ return operands[0] < operands[1]; }
    },
    LOWER_THEN_OR_EQUAL:{
        symbol: '<=', operandCount: 2, associativity: 'LEFT', precedence: 9,
        fn: function(operands, evaluationContext){ return operands[0] <= operands[1]; }
    },
    PLUS: {
        symbol: '+', operandCount: 2, associativity: 'LEFT', precedence: 10,
        fn: function(operands, evaluationContext){ return operands[0]+operands[1]; }
    },
    MINUS:{
        symbol: '-', operandCount: 2, associativity: 'LEFT', precedence: 11,
        fn: function(operands, evaluationContext){ return operands[0]-operands[1]; }
    },
    MULTIPLY:{
        symbol: '*', operandCount: 2, associativity: 'LEFT', precedence: 12,
        fn: function(operands, evaluationContext){ return operands[0]*operands[1]; }
    },
    DIVIDE:{
        symbol: '/', operandCount: 2, associativity: 'LEFT', precedence: 13,
        fn: function(operands, evaluationContext){ return operands[0]/operands[1]; }
    },
    MODULO:{
        symbol: '%', operandCount: 2, associativity: 'LEFT', precedence: 14,
        fn: function(operands, evaluationContext){ return operands[0]%operands[1]; }
    }
}


export default operators