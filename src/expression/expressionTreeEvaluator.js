import tokenizer from '../tokenizer.js';


class ExpressionTreeEvaluator {
  constructor(evaluator) {
    this.evaluator = evaluator;
    this.functionBrackets = {'(': {open: '(', close: ')'}, ')': {open: '(', close: ')'}};
    this.expressionBrackets = {'(': {open: '(', close: ')'}, ')': {open: '(', close: ')'}};
    this.tokenDelimitersBuilder = ['(', ')'];
  }

  toString(tree) {


  }

  fromString(expr){

    //let tokenized = this.evaluator.jsulator.tokenizer.tokenize(expression);
    //console.log('tokenized jsulator', tokenized);

    let tokens = tokenizer.tokenize(expr);
    console.log('tokenized tokenizer', tokens);

    const values = [];
    const argumentTokens = [];
    const stack = [];
    const previousValuesSize = [];


    let token, previousToken;
    /*for (let i = 0; i < tokens.length; i++) {
      let currentToken = tokens[i];
      previousToken = token;
      token = this.evaluator.jsulator._toToken(previousToken, currentToken);

    }*/

    for (let i = 0; i < tokens.length; i++) {
      let currentToken = tokens[i];
      previousToken = token;
      token = this.evaluator.jsulator._toToken(previousToken, currentToken);


      //   console.log('Created new token', token);
      if (token.kind === 'OPEN_BRACKET') {
        stack.splice(0, 0, token);
        if (previousToken && previousToken.kind === 'FUNCTION') {
          if (!this.functionBrackets['(']) {
            throw new Error("Invalid bracket after function: " + currentToken + ' expr: ' + expr);
          }
        } else if (!this.expressionBrackets['(']) {
          throw new Error("Invalid bracket in expression: " + currentToken + ' expr: ' + expr);
        }

      } else if (token.kind === 'CLOSE_BRACKET') {
        if (!previousToken) {
          throw new Error('Expression cannot start with a close bracket');
        }
        if (previousToken.kind == 'FUNCTION_SEPARATOR') {
          throw new Error('argument missing expr: ' + expr);
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
          //this._output(values, argCount, context);
          argumentTokens.splice(0, 0, argCount);
        }
        if (!openBracketFound) {
          throw new Error("Parentheses mismatched for expression: " + expr);
        }

        if (stack.length && stack[0].kind === 'FUNCTION') {
          let tmpArgCount = values.length - (previousValuesSize.length > 0 ? previousValuesSize.splice(0, 1)[0] : 0);
          let tmpToken = stack.splice(0, 1)[0];
         // this._doFunction(values, tmpToken, tmpArgCount, argumentTokens, context);
          argumentTokens.splice(0, 0, tmpToken);
        }

      } else if (token.kind === 'FUNCTION_SEPARATOR') {
        if (!previousToken) {
          throw new Error("expression can't start with a function argument separator expr: " + expr)
        }
        if (previousToken.kind === 'OPEN_BRACKET' || previousToken.kind === 'FUNCTION_SEPARATOR') {
          throw new Error("argument is missing expr: " + expr);
        }

        let sc3 = false;
        while (stack.length > 0) {
          if (stack[0].kind === 'OPEN_BRACKET') {
            sc3 = true;
            break;
          }
          let tmpToken = stack.splice(0, 1)[0];

          //this._output(values, tmpToken, context);
          argumentTokens.splice(0, 0, tmpToken);
        }
        if (!sc3) {
          throw new Error("Separator or parentheses mismatched");
        }

      } else if (token.kind === 'FUNCTION') {
        stack.splice(0, 0, token);
        previousValuesSize.splice(0, 0, values.length);
      } else if (token.kind !== 'OPERATOR') {
        if (previousToken && previousToken.kind === 'LITERAL') {
          throw new Error("A literal can\'t follow another literal expr: " + expr);
        }
        argumentTokens.splice(0, 0, token);
       // this._output(values, token, context);
      } else {
        while (stack.length > 0) {
          let sc4 = stack[0];
          if (sc4.kind !== 'OPERATOR' || (token.content.associativity !== 'LEFT' || token.content.precedence > sc4.content.precedence) && token.content.precedence >= sc4.content.precedence) {
            break;
          }
          let tmpToken = stack.splice(0, 1)[0];
          argumentTokens.splice(0, 0, tmpToken);
         // this._output(values, tmpToken, context);
        }

        stack.splice(0, 0, token);//stack.push(token);
      }

    }

  }
}

export default ExpressionTreeEvaluator;
