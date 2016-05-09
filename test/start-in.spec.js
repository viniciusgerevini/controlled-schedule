'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('#startIn()', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should not start immediatelly', function() {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    schedule.stop();

    expect(task.callCount).to.be.equal(0);
  });

  it('should start after given time', function(done) {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    setTimeout(function() {
      schedule.stop();
      expect(task.calledOnce).to.be.true;
      done();
    }, 1000);
  });
});
