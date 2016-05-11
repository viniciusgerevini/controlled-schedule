'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('Controlled Schedule', function() {
  it('should throw an error if task not provided', function() {
    expect(() => execute() ).to.throw('Task not provided');
  });

  it('should throw an error if task is not a function', function() {
    expect(() => execute('function') ).to.throw('Task has to be a function');
  });

  it('should create schedule when task provided', function() {
    let task = function() {};
    expect(execute(task)).to.have.property('start');
  });
});
