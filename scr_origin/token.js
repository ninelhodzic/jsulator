
const token = {
    FUNCTION_SEPARATOR:{
        kind: 'FUNCTION_SEPARATOR',
        content: null
    },
    buildOperator(token){
        return { kind: 'OPERATOR', content: token};
    },
    buildFunction(token){
        return { kind: 'FUNCTION', content: token};
    },
    buildOpenToken(token){
        return { kind: 'OPEN_BRACKET', content: token};
    },
    buildCloseToken(token){
        return { kind: 'CLOSE_BRACKET', content: token};
    },
    buildNumber(token){
        return { kind: 'NUMBER', content: token};
    },
    buildLiteralValue(token){
        return { kind: 'LITERAL_VALUE', content: token};
    },
    buildLookupLiteral(token){
        return { kind: 'LOOKUP_LITERAL', content: token}
    },
    buildLiteral(token){
        return { kind: 'LITERAL', content: token}
    }

}

export  default token;