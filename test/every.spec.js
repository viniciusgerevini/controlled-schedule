'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#every', function() {
  it('should repeat task using giving interval', function(done) {
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    let schedule =
      execute(task)
        .every(200)
        .start();

    setTimeout(function() {
      schedule.stop();
      expect(taskCount).to.be.equal(2);
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
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    let schedule =
      execute(task)
        .every('1s')
        .start();

    this.timeout(5000);
    setTimeout(function() {
      schedule.stop();
      expect(taskCount).to.be.equal(3);
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
