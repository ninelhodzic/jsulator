import simpleJsulator from '../../index.js'
import { cloneDeep, merge } from 'lodash'

const helperFunctions = {
  _FOREACH_list(source, expressionToExecute, parentObject, filterOutExpression) {
    const result = [];
    source.forEach((item, index) => {
      const context = {
        _index: index,
        _size: source.length,
        _processedSize: result.length,
        _current: item,
        _prev: index > 0 ? source[index - 1] : null,
        _last: source[source.length - 1],
        _next: index + 1 <= source.length ? source[index + 1] : null,
        _parent: parentObject
      }

      let expr = expressionToExecute;

      let tmpRes = simpleJsulator.evaluate(expr, context);

      if (tmpRes) {

        delete tmpRes['_index'];
        delete tmpRes['_size'];
        delete tmpRes['_processedSize'];
        delete tmpRes['_current'];
        delete tmpRes['_prev'];
        delete tmpRes['_last'];
        delete tmpRes['_next'];
        delete tmpRes['_parent'];

        if (filterOutExpression) {
          tmpRes = simpleJsulator.evaluate(expressionToExecute, tmpRes);
        }
      }

      result.push(tmpRes);
    });
    return result;
  },
  FOREACH(source, expressionToExecute, parentObject, filterOutExpression) {

    if (Array.isArray(source)) {
      return this._FOREACH_list(source, expressionToExecute, parentObject, filterOutExpression);
    } else if (typeof source === 'object') {
      const list = [];
      Object.keys(source).forEach((key) => {
        const obj = {};
        obj[key] = source[key];
        list.push(obj);
      });
      return this._FOREACH_list(list, expressionToExecute, parentObject, filterOutExpression);
    }
  },
  _FLATTEN_mergeListToStack(stack, list) {
  //  console.log('merging list into stack', cloneDeep(stack), cloneDeep(list));
    const stackItem = stack.pop();
    if (null === stackItem) {
      stack.push(list);
    } else if (Array.isArray(stackItem)) {
      const newStackItem = [];
      stackItem.forEach((item) => {
        list.forEach((lItem) => {
          const objMerge = merge(item, lItem);
          newStackItem.push(objMerge);
        });
      });
      stack.push(newStackItem);
    } else if (typeof stackItem === 'object') {
      list.forEach((item) => {
        for (let prop in stackItem) {
          item[prop] = stackItem[prop];
        }
      });
      stack.push(list);
    }
   // console.log('merging list into stack - after', cloneDeep(stack));
  },
  _FLATTEN_mergeSimpleToStack(stack, resolvedKey, value) {
    const stackItem = stack.pop();
    if (null == stackItem) {
      const obj = {};
      obj[resolvedKey] = value;
      stack.push(obj);
    } else {
      if (typeof stackItem === 'object' && !Array.isArray(stackItem)) {
        stackItem[resolvedKey] = value;
        stack.push(stackItem)
      } else if (Array.isArray(stackItem)) {
        stackItem.forEach((obj) => {
          obj[resolvedKey] = value;
        });
        stack.push(stackItem);
      }
    }
  },
  _FLATTEN_map(parentKey, sourceOb) {

    const stack = [];

    //console.log('Processing flatten map', parentKey, cloneDeep(sourceOb), cloneDeep(stack))

    const keys = Object.keys(sourceOb);
    keys.forEach((key, index) => {
      const resolvedKey = parentKey ? parentKey + '_' + key : key;
      const value = sourceOb[key];
      if (value && Array.isArray(value)) {
        const listRes = this._FLATTEN_list(resolvedKey, value);
      //  console.log('ListRes', cloneDeep(listRes), cloneDeep(stack));
        this._FLATTEN_mergeListToStack(stack, listRes);
      //  console.log('ListRes - after merge', cloneDeep(stack));
      } else if (value && typeof value === 'object') {
        const mapRes = this._FLATTEN_map(resolvedKey, value);
     //   console.log('MapRes', cloneDeep(mapRes), cloneDeep(stack));
        this._FLATTEN_mergeListToStack(stack, mapRes);
     //   console.log('MapRes - after merge', cloneDeep(stack));
      } else {
        this._FLATTEN_mergeSimpleToStack(stack, resolvedKey, value);
      }
    });
    //console.log('Processing flatten map - after', parentKey, cloneDeep(sourceOb), cloneDeep(stack))

    let stackItem = stack.pop();

    if (!Array.isArray(stackItem) && typeof stackItem === 'object'){
      const tmpStackItem = cloneDeep(stackItem);
      stackItem = [];
      stackItem.push(tmpStackItem);
    }

   // console.log('single stack item: ', parentKey, cloneDeep(stackItem));

    return stackItem;
  },
  _FLATTEN_list(parentKey, sourceList) {
    const result = [];
    sourceList.forEach((item, index) => {
      if (item && typeof item === 'object') {
        const list = this._FLATTEN_map(parentKey, item);
     //   console.log('list as result from map', cloneDeep(list), cloneDeep(result));
        if (list) {
          list.forEach((i)=>{
            result.push(i);
          });
        }
      } else {
        const obj = {};
        obj[parentKey] = item;
       // console.log('list as result simple', obj);
        result.push(obj);
      }
    });
    return result;
  },
  FLATTEN(source) {
    let listResult = [];
    if (Array.isArray(source)) {
      listResult = this._FLATTEN_list(null, source);
    } else if (typeof source === 'object') {
      listResult = this._FLATTEN_map(null, source);
    }
    return listResult;
  },
  MERGE(sources) {
    const result = [];
    const that = this;
    sources.forEach((source) => {
      if (Array.isArray(source)) {
        const res = that.MERGE(source);
        //result.splice(result.length, 0, [...res[0]]);
        if (res && Array.isArray(res)) {
          res.forEach((item) => {
            result.push(item);
          });
        } else {
          result.push(res);
        }
      } else {
        const res = that.MERGE_Single(source);
        if (res && Array.isArray(res)) {
          res.forEach((item) => {
            result.push(item);
          });
        } else {
          result.push(res);
        }
      }
    });
    return result;
  },
  MERGE_Single(source) {
    const indexMap = {};
    const otherMap = {};
    for (let prop in source) {
      const val = source[prop];
      if (Array.isArray(val)) { // if this is { key: [1, 2, 3] } - e..g array in Key
        if (val.length === 0) {
          otherMap[prop] = null;
        } else {
          val.forEach((valItem, valIndex) => {
            let indexedMap = indexMap[valIndex];
            if (!indexedMap) {
              indexedMap = {}
            }
            indexedMap[prop] = valItem;
            indexMap[valIndex] = indexedMap;
          });
        }
      } else {
        otherMap[prop] = val; // it is normal
      }
    }
    const indexedValues = Object.values(indexMap);
    if (indexedValues.length) {
      indexedValues.map((item) => {
        item = Object.assign(item, otherMap);
      });
    } else {
      indexedValues.push(otherMap);
    }
    return indexedValues;
  },
  GROUP_BY(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  },
  REMAP(source, schema) {
    if (Array.isArray(source)) {
      const newList = [];
      source.forEach((item, index) => {
        const newObj = {};
        Object.keys(schema).map((key, index) => {
          const expression = schema[key];
          const res = simpleJsulator.evaluate(expression, item);
          newObj[key] = res;
        });
        newList.push(newObj);
      });
      return newList;
    } else {
      let newObj = {};
      Object.keys(schema).map((key, index) => {
        const expression = schema[key];
        if (expression) {
          if (typeof expression === 'string') {
            const res = simpleJsulator.evaluate(expression, source);
            newObj[key] = res;
          } else if (Array.isArray(expression)) {
            console.warn('Expression value is an array', expression, key);
            newObj[key] = res;
          } else if (typeof expression === 'object') {
            newObj = {...newObj, ...expression}
          }
        }
      });
      return newObj
    }
  }
}

export default helperFunctions
