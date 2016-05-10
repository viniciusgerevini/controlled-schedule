'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('#stop()', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should stop schedule', function(done) {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every('1s')
        .start();

    schedule.stop();

    setTimeout(function() {
      expect(task.callCount).to.be.equal(1);
      done();
    }, 1500);
  });

  it('should stop schedule (callback)', function(done) {
    let taskCount = 0;
    let task = function(callback) {
      taskCount++;
      callback();
    };

    let schedule =
      execute(task)
        .every('1s')
        .start();

    schedule.stop();

    setTimeout(function() {
      expect(taskCount).to.be.equal(1);
      done();
    }, 1500);
  });
});
