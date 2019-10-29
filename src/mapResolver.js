import DotObject from 'dot-object'

const mapResolver = {
    resolveToMap(expression) {
        return JSON.parse(expression);
    },
    resolveToArray(expression) {
        return JSON.parse(expression);
    },
    resolve(expression, context) {
        let tmp = expression;
        if (expression.startsWith('$') && expression.endsWith('$')) {
            tmp = expression.substring(1, expression.length - 1);
        }
        const res = DotObject.pick(tmp, context);
        return res;
    },
    remove(expression, context) {
        let tmp = expression;
        if (expression.startsWith("'") && expression.endsWith("'")) {
            tmp = expression.substring(1, expression.length - 1);
        }

        const removed = DotObject.remove(tmp, context);
        return context;
    },
    put(dataObject, key, value) {
        const res = DotObject.str(key,value, dataObject);
        return res;
    }
}

export default mapResolver
