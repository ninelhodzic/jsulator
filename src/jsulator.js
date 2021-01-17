import tokenizer from './tokenizer'
import token from './token'

const jsulator = {
  functions: null,
  operators: null,
  constants: null,
  functionArgumentSeparator: ',',
  functionBrackets: {},
  expressionBrackets: {},
  tokenizer: null,
  mapResolver: null,
  matcherToken: /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/,
  init: function () {
    this.functionBrackets = {'(': {open: '(', close: ')'}, ')': {open: '(', close: ')'}};
    this.expressionBrackets = {'(': {open: '(', close: ')'}, ')': {open: '(', close: ')'}};
  },
  jsulator: function (parameters, mapResolver) {
    this.mapResolver = mapResolver;

    this.init();
    this.functions = {};
    this.operators = {};
    this.constants = {};

    const tokenDelimitersBuilder = ['(', ')'];
    const that = this;
    // console.log('parameters', parameters);

    parameters.forEach(function (param) {
      const symbol = param.symbol;
      switch (param.type) {
        case 'OP':
          tokenDelimitersBuilder.push(symbol);
          let tmpList = that.operators[symbol];
          if (!tmpList) {
            tmpList = [];
          }
          tmpList.push(param);
          that.operators[symbol] = tmpList;
          if (tmpList.length > 1) {
            throw new Error('Invalid number of same operators: ' + symbol + ' - ' + JSON.stringify(tmpList));
          }
          break;
        case 'FN':
          that.functions[param.name] = param;
          if (param.maxArgumentCount > 1) {
            tokenDelimitersBuilder.push(that.functionArgumentSeparator);
          }
          break;
        case 'CS':
          that.constants[param.name] = param;
          break;
      }
    });

    this.tokenizer = tokenizer.tokenizer(tokenDelimitersBuilder);

    return this;
  },
  tokenize(expression) {
    return tokenizer.tokenize(expression);
  },
  _guessOperator: function (previousToken, candidates) {
    const argCount = previousToken === null || previousToken.kind !== 'CLOSE_BRACKET' && (previousToken.kind !== 'LITERAL' || previousToken === 'LITERAL_VALUE') ? 1 : 2;

    let op = null, counter = 0;
    do {
      if (candidates.length == counter)
        return null;
      op = candidates[counter];

      ++counter;
    } while (op.operandCount !== argCount);

  },
  _getBracketPair: function (tokenStr) {
    return this.expressionBrackets[tokenStr] || this.functionBrackets[tokenStr];
  },
  _toToken: function (previousToken, currentToken) {
    if (currentToken === this.functionArgumentSeparator) {
      return token.FUNCTION_SEPARATOR;
    } else if (this.functions[currentToken]) {
      return token.buildFunction(this.functions[currentToken]);
    } else if (this.operators[currentToken]) {
      const opArray = this.operators[currentToken];
      return opArray.length === 1 ? token.buildOperator(opArray[0]) : token.buildOperator(this._guessOperator(token, opArray));
    } else {
      let bracketPair = this._getBracketPair(currentToken);
      if (bracketPair) {
        return bracketPair.open === currentToken ? token.buildOpenToken(bracketPair) : token.buildCloseToken(bracketPair);
      } else {
        let number = Number(currentToken);
        if (!Number.isNaN(number)) {
          return token.buildNumber(number);
        } else if ((currentToken.startsWith("'") && currentToken.endsWith("'")) || (currentToken.startsWith("\"") && currentToken.endsWith("\""))) {
          return token.buildLiteralValue(currentToken.substring(1, currentToken.length - 1));
        } else if (currentToken.startsWith("$") && currentToken.endsWith("$")) {
          return token.buildLookupLiteral(currentToken);
        } else {
          return token.buildLiteral(currentToken);
        }

      }
    }
  },
  _output(values, token, context) {
    /*if (token.kind === 'LITERAL') {
      let res = this.constants[token.content];
      if (!res) {
        res = token.content;
      }
      values.splice(0, 0, res);
    } else */
    if (token.kind === 'LOOKUP_LITERAL' || token.kind === 'LITERAL') {
      let res = this.constants[token.content];
      if (!res) {
        res = token.content;
      }
      if (res.toLowerCase() === 'true') {
        res = true;
      } else if (res.toLowerCase() === 'false') {
        res = false;
      } else {
        res = this.mapResolver.resolve(res, context);//this.mapResolver.resolve(res, context);
      }
      values.splice(0, 0, res);

    } else if (token.kind === 'LITERAL_VALUE') {
      values.splice(0, 0, token.content);
    } else if (token.kind === 'NUMBER') {
      values.splice(0, 0, token.content);
    } else {
      if (token.kind !== 'OPERATOR') {
        console.log('Wrong token', token, values);
        throw new Error("Token is not valid Operator: " + token.content);
      }
      const res = this._evaluateToken(token, this._getArguments(values, token.content.operandCount), context);
      values.splice(0, 0, res);
    }
  },
  _getArguments(values, argCount) {
    if (values.length < argCount) {
      throw new Error("There is values size: " + values.length + " less then required: " + argCount);
    }
    //console.log('values', values);
    const res = [];
    for (let i = 0; i < argCount; i++) {
      res.splice(0, 0, (values.splice(0, 1)[0]));
    }
    //console.log('res values', res);
    return res;
  },
  _evaluateToken(token, args, context) {
    const tmp = token.content.fn.call(this, args, context);
    return tmp;
  },
  _doFunction(values, token, argCount, argumentTokens, context) {
    const args = this._getArguments(values, argCount);
    const argsTokens = this._getArguments(argumentTokens, argCount);

    const res = token.content.fn.call(this, args, argsTokens, context);
    //  console.log('function result', res);
    values.splice(0, 0, res);
    // return tmp;
  },
  evaluate(expression, context) {
    if (!expression)
      return null;

    if (!this.matcherToken.test(expression)) {
      return expression;
    }

    if (expression.startsWith('{') && expression.endsWith('}')) {
      return this.mapResolver.resolveToMap(expression);
    }
    if (expression.startsWith('[') && expression.endsWith(']')) {
      return this.mapResolver.resolveToArray(expression);
    }
    /* const match = expression.match(/[a-zA-Z0-9 _:\.@]+/);
     if (match) { //match string without special characters as string not expression
         return expression;
     }*/

    const values = [];
    const argumentTokens = [];
    const stack = [];
    const previousValuesSize = [];//this.functions.length===0? [] : null;

    const tokens = this.tokenize(expression);
   // console.log('tokenizer tokenized', tokens);
    let token, previousToken;
    for (let i = 0; i < tokens.length; i++) {
      let currentToken = tokens[i];
      previousToken = token;
      token = this._toToken(previousToken, currentToken);
      //   console.log('Created new token', token);
      if (token.kind === 'OPEN_BRACKET') {
        stack.splice(0, 0, token);
        if (previousToken && previousToken.kind === 'FUNCTION') {
          if (!this.functionBrackets['(']) {
            throw new Error("Invalid bracket after function: " + currentToken);
          }
        } else if (!this.expressionBrackets['(']) {
          throw new Error("Invalid bracket in expression: " + currentToken);
        }

      } else if (token.kind === 'CLOSE_BRACKET') {
        if (!previousToken) {
          throw new Error('Expression cannot start with a close bracket');
        }
        if (previousToken.kind == 'FUNCTION_SEPARATOR') {
          throw new Error('argument missing');
        }

        const brackets = token.content;
        let openBracketFound = false;
        while (stack.length > 0) {
          let argCount = stack.splice(0, 1)[0];
          if (argCount.kind === 'OPEN_BRACKET') {
            // check for invalid parenthesis
            openBracketFound = true;
            break;
          }
          this._output(values, argCount, context);
          argumentTokens.splice(0, 0, argCount);
        }
        if (!openBracketFound) {
          throw new Error("Parentheses mismatched for expression: " + expression);
        }

        if (stack.length && stack[0].kind === 'FUNCTION') {
          let tmpArgCount = values.length - (previousValuesSize.length > 0 ? previousValuesSize.splice(0, 1)[0] : 0);
          let tmpToken = stack.splice(0, 1)[0];
          this._doFunction(values, tmpToken, tmpArgCount, argumentTokens, context);
          argumentTokens.splice(0, 0, tmpToken);
        }

      } else if (token.kind === 'FUNCTION_SEPARATOR') {
        if (!previousToken) {
          throw new Error("expression can't start with a function argument separator")
        }
        if (previousToken.kind === 'OPEN_BRACKET' || previousToken.kind === 'FUNCTION_SEPARATOR') {
          throw new Error("argument is missing");
        }

        let sc3 = false;
        while (stack.length > 0) {
          if (stack[0].kind === 'OPEN_BRACKET') {
            sc3 = true;
            break;
          }
          let tmpToken = stack.splice(0, 1)[0];

          this._output(values, tmpToken, context);
          argumentTokens.splice(0, 0, tmpToken);
        }
        if (!sc3) {
          throw new Error("Separator or parentheses mismatched");
        }

      } else if (token.kind === 'FUNCTION') {
        stack.splice(0, 0, token);//stack.push(token);
        previousValuesSize.splice(0, 0, values.length);
      } else if (token.kind !== 'OPERATOR') {
        if (previousToken && previousToken.kind === 'LITERAL') {
          throw new Error("A literal can\'t follow another literal");
        }
        argumentTokens.splice(0, 0, token);
        this._output(values, token, context);
      } else {
        while (stack.length > 0) {
          let sc4 = stack[0];
          if (sc4.kind !== 'OPERATOR' || (token.content.associativity !== 'LEFT' || token.content.precedence > sc4.content.precedence) && token.content.precedence >= sc4.content.precedence) {
            break;
          }
          let tmpToken = stack.splice(0, 1)[0];
          argumentTokens.splice(0, 0, tmpToken);
          this._output(values, tmpToken, context);
        }

        stack.splice(0, 0, token);//stack.push(token);
      }

    }

    while (stack.length > 0) {
      //  console.log('stack in while', stack);
      let tmpToken = stack.splice(0, 1)[0];
      if (tmpToken.kind === 'OPEN_BRACKET' || tmpToken.kind === 'CLOSE_BRACKET') {
        throw new Error("Parentheses mismatched");
      }
      argumentTokens.splice(0, 0, tmpToken);
      this._output(values, tmpToken, context);
    }
    if (values.length != 1) {
      throw new Error("Values size is not 1");
    } else {
      return values.splice(0, 1)[0];
    }
  }
}

export default jsulator
