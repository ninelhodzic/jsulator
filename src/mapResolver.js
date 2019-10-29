const mapResolver = {
    resolveToMap(expression) {
        return JSON.parse(expression);
    },
    resolveToArray(expression) {
        return JSON.parse(expression);
    },
    resolve(expression, context) {
        let tmp = expression;
        if (expression.startsWith('$') && expression.endsWith('$')){
            tmp = expression.substring(1, expression.length-1);
        }
        return context[tmp];
    }
}

export default mapResolver