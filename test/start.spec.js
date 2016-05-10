'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('#start()', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should start immediatelly', function() {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every('1s')
        .start();

    schedule.stop();

    expect(task.calledOnce).to.be.true;
  });

  it('should start immediatelly (callback)', function() {
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

    expect(taskCount).to.be.equal(1);
  });
});
