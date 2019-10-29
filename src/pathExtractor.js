const pathExtractor = {
  _recursivePathResolver(scope, path, pathIndex = 0) {
    if (typeof scope !== 'object' || scope === null || scope === undefined) {
      return '';
    }

    const varName = path[pathIndex];
    const value = scope[varName];

    if (pathIndex === path.length - 1) {
      // It's a leaf, return whatever it is
      return value;
    }

    return this._recursivePathResolver(value, path, ++pathIndex);
  },
    resolve(expression, dataContext) {
        return this._recursivePathResolver(dataContext, expression.split('.')); //dataContext[expression];
    }
}

export default pathExtractor
