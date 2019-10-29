import pathExtractor from './pathExtractor'
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
        // return pathExtractor.resolve(tmp, context);
        const res = DotObject.pick(tmp, context);
        console.log('Res dotObject pick', tmp, context, res);
        return res;
    },
    remove(expression, context) {
        let tmp = expression;
        if (expression.startsWith("'") && expression.endsWith("'")) {
            tmp = expression.substring(1, expression.length - 1);
        }
        //return pathExtractor.remove(tmp, context);

        const removed = DotObject.remove(tmp, context);
        console.log('Res dotObject Delete', tmp, context, removed);
        return context;
    },
    put(dataObject, key, value) {
        /*const res = pathExtractor.put(dataObject, key, value);
        return res;*/

        //const res = [];
        console.log('Res dotObject str = before =>', key, value, dataObject);
        const res = DotObject.str(key,value, dataObject);
        console.log('Res dotObject str = after =>', key, value, dataObject, res);
        return res;
    }
}

export default mapResolver
