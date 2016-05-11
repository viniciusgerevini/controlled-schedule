'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#start()', function() {
  it('should start immediatelly', function() {
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    let schedule =
      execute(task)
        .every('1s')
        .start();

    schedule.stop();

    expect(taskCount).to.be.equal(1);
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
