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
});
