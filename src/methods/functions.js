import cloneDeep from 'lodash/cloneDeep'
import mapResolve from '../mapResolver'
import {DateTime} from "luxon";

const replaceCircular = function (val, cache) { // TODO - review this in case of VUE object
  cache = cache || new WeakSet();
  if (val && typeof (val) === 'object') {
    if (cache.has(val)) return '[Circular]';
    if (val && (val.$vnode || val._isVue || val.__file)){
      return '[Vue Instance]';
    }
    cache.add(val);
    const obj = (Array.isArray(val) ? [] : {});
    for (var idx in val) {
      obj[idx] = replaceCircular(val[idx], cache);
    }
    cache.delete(val);
    return obj;
  }
  return val;
};

const functions = {
  IS_NULL: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0] === null || operands[0] === undefined;
    }
  },
  SET_NULL: {
    minArgumentCount: 0, maxArgumentCount: 0,
    fn: function (operands, argumentList, evaluationContext) {
      return null;
    }
  },
  SIZE_OF: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].length;
    }
  },
  TYPE_OF: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return typeof (operands[0]);
    }
  },
  IS_OF_TYPE: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      return typeof (operands[0]) === operands[1];
    }
  },
  IF: {
    minArgumentCount: 3, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      // console.log('IF', operands, argumentList)
      if (operands[0]) {
        return operands[1];
      } else {
        return operands[2];
      }
    }
  },
  NOW: {
    minArgumentCount: 0, maxArgumentCount: 0,
    fn: function (operands, argumentList, evaluationContext) {
      return new Date();
    }
  },
  MINUTE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].getMinutes();
    }
  },
  HOUR: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].getHours();
    }
  },
  DAY: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].getDay();
    }
  },
  MONTH: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].getMonth();
    }
  },
  YEAR: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].getFullYear();
    }
  },
  DATE_DIFF: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0] - operands[1];
    }
  },
  TO_DATE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return new Date(operands[0]);
    }
  },
  TO_INT: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return parseInt(operands[0])
    }
  },
  TO_DOUBLE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return parseFloat(operands[0])
    }
  },
  TO_STRING: {
    minArgumentCount: 1, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      if (typeof operands[0].getMonth === 'function') {
        return DateTime.fromJSDate(operands[0]).toFormat(operands[1]);
      } else if (typeof (operands[0]) === 'object') {
        return JSON.stringify(replaceCircular(operands[0]), null, 2);
      } else {
        return operands[0].toString();
      }
    }
  },
  TO_BOOLEAN: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      let val = operands[0];
      //console.log('typeof val=>'+ typeof(val));
      if (typeof (val) === 'string') {
        return JSON.parse(val);
      } else if (typeof (val) === 'number') {
        return val === 0 ? false : true;
      } else if (typeof (val) === 'boolean') {
        return val;
      } else {
        val = val.toString();
        return val === 'true';
      }
    }
  },
  TO_LOWERCASE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].toLowerCase();
    }
  },
  TO_UPPERCASE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].toUpperCase();
    }
  },
  TO_JSON: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return JSON.parse(operands);
    }
  },
  ABS: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return Math.abs(operands[0]);
    }
  },
  REGEX_MATCH: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      const string = operands[0], regex = operands[1];
      return string.match(regex);
    }
  },
  REGEX_EXTRACT: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      const string = operands[0], regex = operands[1];
      return string.exec(regex);
    }
  },
  REGEX_REPLACE: {
    minArgumentCount: 3, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      const string = operands[0], regex = operands[1], replacement = operands[2];
      return string.replace(regex, replacement);
    }
  },
  STRING_FORMAT: {},
  REPLACE_ALL: {
    minArgumentCount: 3, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      const string = operands[0], regex = operands[1], replacement = operands[2];
      return string.split(regex).join(replacement);
    }

  },
  CONTAINS: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      // console.log('CONTAINS', operands, argumentList)
      return operands[0].indexOf(operands[1]) > -1 ? true : false;
    }
  },
  SPLITTER: {
    minArgumentCount: 1, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      const target = operands[0];
      let splitter = ',';
      if (operands.length > 1) {
        splitter = operands[1];
      }
      return target.splice(splitter);
    }
  },
  SUBSTRING: {
    minArgumentCount: 2, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      const target = operands[0];
      let start = 0;
      let end = target.length - 1;//operands[1]; //
      if (operands.length === 3) {
        start = operands[1];
        end = operands[2];
      }
      //const res =
      //console.log('substring', res, start, end);
      return target.substring(start, end); //res;
    }
  },
  INDEX_OF: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      //console.log('INDEX_OF', operands, argumentList)
      const target = operands[0];
      const indexOf = operands[1];
      return target.indexOf(indexOf);
    }
  },

  SELECT: {
    minArgumentCount: 1, maxArgumentCount: Number.MAX_SAFE_INTEGER,
    fn: function (operands, argumentList, evaluationContext) {
      const res = {};
      operands.forEach(function (item) {
        const token = argumentList.splice(-1, 1);
        const key = token.content;
        res[key] = item;
      });
      return res;
    }
  },
  LIST: {
    minArgumentCount: 1, maxArgumentCount: Number.MAX_SAFE_INTEGER,
    fn: function (operands, argumentList, evaluationContext) {
      let res = [];
      operands.forEach(function (item) {
        res = res.concat(item);
      });
      return res;
    }
  },
  MAP: {
    minArgumentCount: 0, maxArgumentCount: Number.MAX_SAFE_INTEGER,
    fn: function (operands, argumentList, evaluationContext) {
      const tmpObj = {};
      //  console.log('MAP operands', operands, argumentList, evaluationContext);
      operands.forEach(function (item) {
        //   console.log('typeof' + typeof (item));

        if (typeof (item) === 'object') {
          for (let prop in item) {
            tmpObj[prop] = item[prop];
          }
        }
      });
      return tmpObj;
    }
  },
  FIELD: {
    minArgumentCount: 2, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      //     console.log('called field', operands, argumentList, evaluationContext);
      const tmpObj = {};
      tmpObj[operands[0]] = operands[1];
      return tmpObj;
    }
  },
  REMOVE: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      //   console.log('REMOVE fn=> ', operands, argumentList, evaluationContext);
      let res = mapResolve.remove(operands[0], evaluationContext);
      return res;
    }
  },
  THIS: {
    minArgumentCount: 0, maxArgumentCount: 0,
    fn: function (operands, argumentList, evaluationContext) {
      return evaluationContext;
    }
  },
  COPY: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      return cloneDeep(operands[0]);
    }
  },
  UNION: {
    minArgumentCount: 1, maxArgumentCount: Number.MAX_SAFE_INTEGER,
    fn: function (operands, argumentList, evaluationContext) {
      const res = [];
      operands.forEach(function (item) {
        res.push(item);
      });
      return res;
    }
  },
  EXTEND: {
    minArgumentCount: 1, maxArgumentCount: Number.MAX_SAFE_INTEGER,
    fn: function (operands, argumentList, evaluationContext) {
      const target = {};
      //     console.log('Extend', operands, argumentList, evaluationContext);
      operands.forEach(function (item) {
        for (const prop in item) {
          target[prop] = item[prop];
        }
      });
      return target;

    }
  },
  REMAP: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      let source = operands[0];
      if (source === null || source === undefined) {
        return undefined;
      }
      source = cloneDeep(source);
      let schema = cloneDeep(operands[1]);

      if (typeof (schema) === 'string') {
        schema = mapResolve.resolveToMap(schema);
      }

      if (typeof (source) === 'string') {
        if (source.startsWith('[')) {
          source = mapResolve.resolveToArray(source);
        } else {
          source = mapResolve.resolveToMap(source);
        }
      }
      if (Array.isArray(source)) {
        const newList = [];
        source.forEach((item, index) => {
          const newObj = {};
          Object.keys(item).map((key, index) => {
            newObj[schema[key]] = item[key];
          });
          newList.push(newObj);
        });
        return newList;
      } else {
        const newObj = {};
        Object.keys(source).map((key, index) => {
          newObj[schema[key]] = source[key];
        });
        return newObj
      }
    }
  },
  KEYS: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      const target = operands[0];
      const res = [];
      for (const prop in target) {
        res.push(prop)
      }
      return res;
    }
  },
  VALUES: {
    minArgumentCount: 1, maxArgumentCount: 1,
    fn: function (operands, argumentList, evaluationContext) {
      const target = operands[0];
      const res = [];
      for (const prop in target) {
        res.push(target[prop])
      }
      return res;
    }
  },
  EXCLUDE_FIELDS: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      const target = operands[0];
      const listOfPros = operands[1];
      listOfPros.forEach(function (prop) {
        delete target[prop];
      });
    }
  },
  GET: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0][operands[1]];
    }
  },
  ADD: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      const target = cloneDeep(operands[0]);
      const item = cloneDeep(operands[1]);
      target.push(item);
      return target;
    }
  },
  INSERT: {
    minArgumentCount: 3, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      const target = cloneDeep(operands[0]);
      const index = cloneDeep(operands[1]);
      const item = cloneDeep(operands[2]);
      target.splice(index, 1, item);
      return target;
    }
  },
  PUT: {
    minArgumentCount: 3, maxArgumentCount: 3,
    fn: function (operands, argumentList, evaluationContext) {
      //operands[0][operands[1]]=operands[2];
      //console.log('PUT operands =>', operands, argumentList, evaluationContext);
      const res = mapResolve.put(operands[0], operands[1], operands[2]);
      return res;
    }
  },
  LIMIT: {
    minArgumentCount: 2, maxArgumentCount: 2,
    fn: function (operands, argumentList, evaluationContext) {
      return operands[0].slice(0, operands[1]);
    }
  }
}

export default functions
