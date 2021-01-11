import {expect} from 'chai';

import simpleJsulator, {tokenizer} from '../src'


describe("tokenizer", function () {
  var tokeniser;
  before(function () {
    tokeniser = tokenizer.tokenizer(['(', ')', '+', '!']);
  });
  it('it tokenize', function () {
    expect(tokeniser.tokenize('5+4+3')).to.eql(['5', '+', '4', '+', '3']);
  });
});

describe("simpleJsulator", function () {
  var jsulator;

  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
  });

  it('returns an mapResolver', function () {
    expect(jsulator.jsulator.mapResolver).to.not.eql(null);
  });

  it('returns an sum', function () {
    expect(jsulator.evaluate('2+2')).to.eql(4);
  });

  it('returns null', function () {
    expect(jsulator.evaluate('')).to.eql(null);
  });

  it('returns expression', function () {
    expect(jsulator.evaluate('expression', {})).to.eql('expression');
  });

  it('returns missing', function () {
    expect(jsulator.evaluate('$expression$', {})).to.eql(undefined);
  });

  it('returns empty object', function () {
    expect(jsulator.evaluate('{}')).to.eql({});
  });

  it('returns not true', function () {
    expect(jsulator.evaluate('!true')).to.eql(false);
  });
  it('returns from context', function () {
    expect(jsulator.evaluate("$message$+' World'", {message: 'Hello'})).to.eql('Hello World');
  });

  it('returns simple object array from context', function () {
    expect(jsulator.evaluate("$a[].name$", {a: [{name: 'name1'}, {name: 'name2'}]})).to.eql(['name1', 'name2']);
  });


  it('returns sum from context', function () {
    expect(jsulator.evaluate("$a$+$b$", {a: 10, b: 20})).to.eql(30);
  });

  it('returns greater from context', function () {
    expect(jsulator.evaluate("$a$>$b$", {a: 30, b: 20})).to.eql(true);
  });

  it('returns FIELD from context', function () {
    expect(jsulator.evaluate("FIELD('key', 34+1)")).to.eql({key: 35});
  });

  it('returns MAP FIELD from context', function () {
    expect(jsulator.evaluate("MAP(FIELD('key', $kk$+1), FIELD('key1', $kk$))", {kk: 89})).to.eql({key: 90, key1: 89});
  });

  it('returns SIZE_OF from context', function () {
    expect(jsulator.evaluate("SIZE_OF($v$)", {v: ['1', '2', '3']})).to.eql(3);
  });

  it('returns IS_NULL from context', function () {
    expect(jsulator.evaluate("IS_NULL($v$)", {v: ['1', '2', '3']})).to.eql(false);
  });

  it('returns SET_NULL from context', function () {
    expect(jsulator.evaluate("SET_NULL()")).to.eql(null);
  });
  it('returns THIS from context', function () {
    expect(jsulator.evaluate("THIS()", {v: ['1', '2', '3']})).to.eql({v: ['1', '2', '3']});
  });

  it('returns IF from context', function () {
    expect(jsulator.evaluate("IF(2>3,4,5)")).to.eql(5);
  });

  it('returns TO_BOOLEAN from context', function () {
    expect(jsulator.evaluate("TO_BOOLEAN(5)")).to.eql(true);
  });

  it('returns complex EXTEND from context', function () {
    expect(jsulator.evaluate("FIELD('obj', EXTEND($obj$, FIELD('key', 1), FIELD('key2', 2)))", {
      obj: {
        name: 'obj',
        arr: [1, 2, 3]
      }
    })).to.eql({obj: {key: 1, key2: 2, name: 'obj', arr: [1, 2, 3]}});
  });

  it('returns complex THIS and FIELD from context', function () {
    expect(jsulator.evaluate("FIELD('th', THIS())", {obj: {name: 'name1', age: 23}})).to.eql({
      th: {
        obj: {
          name: 'name1',
          age: 23
        }
      }
    });
  });

  it('returns REMOVE property from context', function () {
    expect(jsulator.evaluate("REMOVE('obj.name')", {obj: {name: 'name1', age: 23}})).to.eql({obj: {age: 23}});
  });

  it('returns PUT property to context', function () {
    expect(jsulator.evaluate("FIELD('obj', PUT($obj$,'name','nesto'))", {
      obj: {
        name: 'name1',
        age: 23
      }
    })).to.eql({obj: {age: 23, name: 'nesto'}});
  });

  it('INSERT to List at position', function () {
    expect(jsulator.evaluate("FIELD('arr', INSERT($arr$, INDEX_OF($arr[].user$, 'user1'), FIELD('user','user1_11')))",
      {arr: [{user: 'user2'}, {user: 'user1'}, {user: 'user3'}]}))
      .to.eql({arr: [{user: 'user2'}, {user: 'user1_11'}, {user: 'user3'}]});
  });

  it('REMAP map to map', function () {
    expect(jsulator.evaluate("REMAP($map$, '{\"n\":\"name\",\"v\":\"value\"}')", {map: {n: '1', v: '1'}}))
      .to.eql({name: '1', value: '1'})
  });

  it('REMAP list to list', function () {
    expect(jsulator.evaluate("REMAP($list$, '{\"n\":\"name\",\"v\":\"value\"}')", {
      list: [{n: '1', v: '1'}, {
        n: '2',
        v: '2'
      }]
    }))
      .to.eql([{name: '1', value: '1'}, {name: '2', value: '2'}])
  });

  it('Format date', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("TO_STRING(TO_DATE('2020-09-03'), 'yyyy-MM-dd')")
    ).to.eql('2020-09-03')
  });

  it('Math ABS', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("MATH('abs', $b$)", {b: -1})
    ).to.eql(1)
  });

  it('Math ROUND', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("MATH('round', $b$)", {b: 24.1353523523523})
    ).to.eql(24)
  });

  it('ROUND', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("ROUND($b$, 2)", {b: 24.1353523523523})
    ).to.eql(24.14)
  });

  it('SUM', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("SUM(THIS())", [1, 2, 3])
    ).to.eql(6)
  });
  it('AVG', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("AVG(THIS())", [1, 2, 3])
    ).to.eql(2)
  });
  it('MIN', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("MIN(THIS())", [1, 2, 3])
    ).to.eql(1)
  });
  it('MAX', function () {
    const now = new Date();
    expect(
      jsulator.evaluate("MAX(THIS())", [1, 2, 3])
    ).to.eql(3)
  });
});
