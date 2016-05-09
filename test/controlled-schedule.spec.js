'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('Controlled Schedule', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should throw an error if task not provided', function() {
    expect(() => execute() ).to.throw('Task not provided');
  });

  it('should throw an error if task is not a function', function() {
    expect(() => execute('function') ).to.throw('Task has to be a function');
  });

  it('should create schedule when task provided', function() {
    let task = sandbox.stub();
    expect(execute(task)).to.have.property('start');
  });
});
