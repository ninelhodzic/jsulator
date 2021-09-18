import simpleJsulator from '../../index'

const helperFunctions = {
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
