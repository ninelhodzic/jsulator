import DotObject from 'dot-object'
import pathExtractor from './pathExtractor.js'

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
        const res = pathExtractor.resolve(tmp, context); //DotObject.pick(tmp, context);
        //console.log('Pick', res, tmp, expression);
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
