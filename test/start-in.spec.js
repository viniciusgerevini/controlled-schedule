'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#startIn()', function() {
  it('should not start immediatelly', function() {
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    schedule.stop();

    expect(taskCount).to.be.equal(0);
  });

  it('should not start immediatelly (callback)', function() {
    let taskCount = 0;
    let task = function(callback) {
      taskCount++;
      callback();
    };

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    schedule.stop();

    expect(taskCount).to.be.equal(0);
  });

  it('should start after given time', function(done) {
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    setTimeout(function() {
      schedule.stop();
      expect(taskCount).to.be.equal(1);
      done();
    }, 1000);
  });

  it('should start after given time (callback)', function(done) {
    let taskCount = 0;
    let task = function(callback) {
      taskCount++;
      callback();
    };

    let schedule =
      execute(task)
        .every(100)
        .startIn('1s');

    setTimeout(function() {
      schedule.stop();
      expect(taskCount).to.be.equal(1);
      done();
    }, 1000);
  });
});
