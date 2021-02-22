import {expect} from 'chai';
import simpleJsulator from "../src/simpleJsulator";


describe("aggregation", function () {
  let jsulator;
  const data = [{ shop: "XYZ", "item" : "A", sizes: [ "S", "M", "L"], price: '99' },
    { shop: "XYZ", "item" : "B", sizes: [ "M", "L"], price: '69' },
    { shop: "XYZ", "item" : "C", sizes: [ "S", "L", "XL"], price: '120' },
    { shop: "MNO", "item" : "A", sizes: [ "S" ], price: '110' },
    { shop: "MNO", "item" : "B", sizes: [ "S", "M", "L"], price: '80' },
    { shop: "MNO", "item" : "C", sizes: [ "S", "M", "XL"], price: '100' },
    { shop: "JKL", "item" : "A", sizes: [ "S", "M", "XL" ], price: '105' },
    { shop: "JKL", "item" : "B", sizes: [ "M", "L"], price: '50' },
    { shop: "JKL", "item" : "C", sizes: [ "M", "XL"], price: '110' }];

  before(function () {
    jsulator = simpleJsulator.simpleJsulator();
  });
// const expression = "AGGREGATE('#collection.match(function(item){ return item.price > 60}).unwind('sizes').group({ id: ['item', 'sizes'], whereToBuy: { $push: ['shop', 'price'] } })#', THIS())";
  it('aggregates match simple', function () {
    const expression = "AGGREGATE('#collection.match({})#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

  it('aggregates match func', function () {
    const expression = "AGGREGATE('#collection.match(function(item){ return item.price > 60})#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

  it('aggregates match obj', function () {
    const expression = "AGGREGATE('#collection.match({'shop': 'MNO'})#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

  it('aggregates unwind', function () {
    const expression = "AGGREGATE('#collection.unwind('sizes')#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

  it('aggregates unwind and match', function () {
    const expression = "AGGREGATE('#collection.unwind('sizes');collection.match({'shop': 'MNO'})#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

  it('aggregates groupBy average', function () {
    const expression = "AGGREGATE('#collection.group({id: 'shop', avgPrice:{ '$avg': 'price'} })#', THIS())";
    expect(
      jsulator.evaluate(expression, data)
    ).to.not.eql(null);
  });

});
