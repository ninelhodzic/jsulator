//TODO - do not use this - it doesn't work as expected - need to finish

const pathExtractor = {

  fetchDot(notation, obj, remove) {
    const that = this;
    const splittedAndFiltered = notation.split(/[\.\[\]]/g).filter(x => x);
    let previousPath = null;
    const result = splittedAndFiltered.reduce(function (lastObj, currentProp, currentIndex, arr) {
      try {
        if (null === lastObj || undefined === lastObj) {
          return lastObj;
        }
        if (Array.isArray(lastObj)) {
          if (!Number.isNaN(Number(currentProp))) {
            if (remove) {
              let tmp = lastObj;
              if (currentIndex < arr.length - 1) {
                tmp = lastObj[currentIndex];
              } else {
                lastObj.splice(currentProp, 1);
                tmp = lastObj;
              }
              previousPath = previousPath ? previousPath + '[' + currentProp + ']' : currentProp;
              return tmp;
            } else {
              return lastObj[currentProp];
            }

          } else {
            let res = [];
            lastObj.forEach(function (item) {
              let tmp = that.fetchDot(currentProp, item, remove);
              if (!remove || (remove && tmp)) {
                if (tmp)
                  res.push(tmp);
              }
            });
            if (previousPath && remove) {
              const obj = {};
              obj[previousPath] = res;
              return obj;
            }
            previousPath = previousPath ? previousPath + '.' + currentProp : currentProp;
            return res;
          }
        }

        if (lastObj.hasOwnProperty(currentProp) || (Array.isArray(lastObj) && lastObj[currentProp])) {
          if (remove && currentIndex + 1 === splittedAndFiltered.length) {
            delete lastObj[currentProp];
            if (previousPath) {
              let obj = {};
              obj[previousPath] = lastObj;
            }
            previousPath = previousPath ? previousPath + '.' + currentProp : currentProp;
            return obj;
          } else {
            previousPath = previousPath ? previousPath + '.' + currentProp : currentProp;
            return lastObj[currentProp];
          }
        }

        if (currentProp === '') {
          return lastObj;
        }

      } catch (ex) {
        console.warn('Error in fetch dot', ex);
        return undefined;
      }
    }, obj);

    return result;
  },
  hasProperty(obj) {
    if (!obj)
      return false;
    let hasProperty = false;
    for (let p in obj) {
      hasProperty = true;
    }
    return hasProperty;
  },
  resolve(expression, dataContext) {
    if (expression)
      expression = expression.trim();

    if (expression === '') {
      return '';
    }
    let res = this.fetchDot(expression, dataContext);
    return res;
  },
  remove(expression, dataContext) {
    let res = this.fetchDot(expression, dataContext, true);
    return res;
  },
  putDot(object, key, value) {
    const that = this;
    const splittedAndFiltered = key.split(/[\.\[\]]/g).filter(x => x);
    let previousPath = null;
    return splittedAndFiltered.reduce(function (lastObj, currentProp, currentIndex, arr) {
      try {
        if (Array.isArray(lastObj)) {
          if (!Number.isNaN(Number(currentProp))) {
            if (currentIndex === arr.length - 1) {
              lastObj[currentProp] = value;
              if (previousPath) {
                const obj = {};
                obj[previousPath] = lastObj;
                previousPath = previousPath ? previousPath + '[' + currentProp + ']' : currentProp;
                return obj;
              }
              previousPath = previousPath ? previousPath + '[' + currentProp + ']' : currentProp;
              return lastObj;
            } else {
              if (currentIndex === arr.length - 1) {
                if (previousPath) {
                  const obj = {};
                  obj[previousPath] = lastObj;
                  return obj;
                }
              }
              previousPath = previousPath ? previousPath + '[' + currentProp + ']' : currentProp;
              return lastObj[currentProp];
            }
          } else {
            let res = [];
            lastObj.forEach(function (item) {
              const tmp = that.putDot(item, currentProp, value);
              res.push(tmp);
            });
            previousPath = previousPath ? previousPath + '.' + currentProp : currentProp;
            return res;
          }
        }

        if (lastObj.hasOwnProperty(currentProp) || lastObj[currentProp]) {
          if (currentIndex === arr.length - 1) {
            lastObj[currentProp] = value;

            if (previousPath) {
              const obj = {};
              obj[previousPath] = lastObj;
              return obj;
            } else {
              return lastObj;
            }
          }
          const o = lastObj[currentProp];
          console.log('lastObj[currentProp]', o, lastObj, currentProp, value);
          previousPath = previousPath ? previousPath + '.' + currentProp : currentProp;
          return o;
        }

      } catch (e) {
        console.warn('Error in put', e);
        return undefined;
      }
    }, object);
  },
  put(dataContext, key, value) {
    const res = this.putDot(dataContext, key, value);
    return res;
  }
}

export default pathExtractor
