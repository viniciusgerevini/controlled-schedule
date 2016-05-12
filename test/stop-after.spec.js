'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#stopAfter()', function() {
  it('should stop schedule after given time', function(done) {
    let taskCount = 0;
    let task = function() {
      taskCount++;
      return Promise.resolve();
    };

    execute(task)
      .every(450)
      .start()
      .stopAfter('1s');

    setTimeout(function() {
      expect(taskCount).to.be.equal(3);
      setTimeout(function() {
        expect(taskCount).to.be.equal(3);
        done();
      }, 500);
    }, 1100);
  });

  it('should stop schedule after given time (callback)', function(done) {
    let taskCount = 0;
    let task = function(callback) {
      taskCount++;
      callback();
    };

    execute(task)
      .every(450)
      .start()
      .stopAfter('1s');

    setTimeout(function() {
      expect(taskCount).to.be.equal(3);
      setTimeout(function() {
        expect(taskCount).to.be.equal(3);
        done();
      }, 500);
    }, 1100);
  });

  it('should start to count stop timer only after start', function(done) {
    let task = function() {
      return Promise.resolve();
    };

    let start = Date.now();
    let schedule =
      execute(task)
        .every(100)
        .stopAfter('1s');

    schedule.on('stop', function() {
      expect(Date.now() - start).to.be.above(1200);
      done();
    });

    setTimeout(function() {
      schedule.start();
    }, 200);
  });

  it('should run stopAfter timer only after startIn started', function(done) {
    let task = function() {
      return Promise.resolve();
    };

    let start = Date.now();
    let schedule =
      execute(task)
        .every(100)
        .stopAfter('1s')
        .startIn(200);

    schedule.on('stop', function() {
      expect(Date.now() - start).to.be.above(1199);
      done();
    });
  });

  it('should not create more then one stop schedule', function(done) {
    let stopCount = 0;
    let task = function() {
      return Promise.resolve();
    };

    execute(task)
      .every(100)
      .stopAfter('500')
      .on('stop', function() {
        stopCount++;
      })
      .start()
      .stopAfter('600');

    setTimeout(function() {
      expect(stopCount).to.be.equal(1);
      done();
    }, 1200);
  });

  it('should be possible to change stop timer', function(done) {
    let task = function() {
      return Promise.resolve();
    };

    let start = Date.now();
    let schedule =
      execute(task)
        .every(100)
        .stopAfter('2s')
        .start()
        .stopAfter('1s');

    schedule.on('stop', function() {
      let stopTime = Date.now() - start;
      expect(stopTime).to.be.above(999);
      expect(stopTime).to.not.be.above(2000);
      done();
    });
  });
});
