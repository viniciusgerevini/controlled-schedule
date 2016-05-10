'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('#every', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should repeat task using giving interval', function(done) {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every(200)
        .start();

    setTimeout(function() {
      schedule.stop();
      expect(task.calledTwice).to.be.true;
      done();
    }, 300);
  });

  it('should repeat task using giving interval (callback)', function(done) {
    let count = 0;
    let task = function(callback) {
      count++;
      callback(null, 'ok');
    };

    let schedule =
      execute(task)
        .every(200)
        .start();

    setTimeout(function() {
      schedule.stop();
      expect(count).to.be.equal(2);
      done();
    }, 300);
  });

  it('should accept duration string', function(done) {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every('1s')
        .start();

    this.timeout(5000);
    setTimeout(function() {
      schedule.stop();
      expect(task.callCount).to.be.equal(3);
      done();
    }, 2100);
  });

  it('should accept duration string (callback)', function(done) {
    let count = 0;
    let task = function(callback) {
      count++;
      callback(null, 'ok');
    };

    let schedule =
      execute(task)
        .every('1s')
        .start();

    this.timeout(5000);
    setTimeout(function() {
      schedule.stop();
      expect(count).to.be.equal(3);
      done();
    }, 2100);
  });
});
