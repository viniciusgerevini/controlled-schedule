'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#stop()', function() {
  it('should stop schedule', function(done) {
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

    setTimeout(function() {
      expect(taskCount).to.be.equal(1);
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
