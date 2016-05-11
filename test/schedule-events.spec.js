'use strict';
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#on', function() {
  it('should throw an error when wrong event', function() {
    let schedule = execute(() => null);
    expect(() => schedule.on('banana', null)).to.throw('Event banana does not exist');
  });

  describe('run', function() {
    it('should trigger after each execution finishes', function(done) {
      let taskCount = 0;
      let task = function() {
        taskCount++;
        return Promise.resolve();
      };

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('run', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(taskCount).to.be.equal(count);
        done();
      }, 1000);
    });

    it('should trigger after each execution finishes (callback)', function(done) {
      let taskCount = 0;
      let task = function(callback) {
        taskCount++;
        callback(null, 'ok');
      };

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('run', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(taskCount).to.be.equal(count);
        done();
      }, 1000);
    });

    it('should pass value to callback', function(done) {
      let taskReturn = 'this is the task value';
      let task = function() {
        return Promise.resolve(taskReturn);
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('run', function(err, value) {
        schedule.stop();
        if (err)
          return done('should not throw an error');

        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should pass value to callback (callback)', function(done) {
      let taskReturn = 'this is the task value';
      let task = function(callback) {
        callback(null, taskReturn);
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('run', function(err, value) {
        schedule.stop();
        if (err)
          return done('should not throw an error');

        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should pass error when fails', function(done) {
      let errorMessage = 'this is an error!';
      let task = function() {
        return Promise.reject(new Error(errorMessage));
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('run', function(err, value) {
        schedule.stop();
        if (err) {
          expect(err.message).to.be.equal(errorMessage);
          expect(value).to.be.undefined;
          return done();
        }

        done('should get an error');
      });

      schedule.start();
    });

    it('should pass error when fails (callback)', function(done) {
      let errorMessage = 'this is an error!';
      let task = function(callback) {
        callback(new Error(errorMessage));
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('run', function(err, value) {
        schedule.stop();
        if (err) {
          expect(err.message).to.be.equal(errorMessage);
          expect(value).to.be.undefined;
          return done();
        }

        done('should get an error');
      });

      schedule.start();
    });

    it('should pass error when task throw an error', function(done) {
      let errorMessage = 'this is an error!';
      let task = function() {
        throw new Error(errorMessage);
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('run', function(err, value) {
        schedule.stop();
        if (err) {
          expect(err.message).to.be.equal(errorMessage);
          expect(value).to.be.undefined;
          return done();
        }

        done('should get an error');
      });

      schedule.start();
    });
  });

  describe('success', function() {
    it('should trigger after each success', function(done) {
      let taskReturn = 'success!';
      let task = function() {
        return Promise.resolve(taskReturn);
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('success', function(value) {
        schedule.stop();
        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should trigger after each success (callback)', function(done) {
      let taskReturn = 'success!';
      let task = function(callback) {
        callback(null, taskReturn);
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('success', function(value) {
        schedule.stop();
        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should not trigger after error', function(done) {
      let taskCount = 0;
      let task = function() {
        taskCount++;
        return Promise.reject();
      };

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('success', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(count).to.be.equal(0);
        expect(taskCount).to.be.above(1);
        done();
      }, 1000);
    });

    it('should not trigger after error (callback)', function(done) {
      let taskCount = 0;
      let task = function(callback) {
        taskCount++;
        callback(new Error());
      };

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('success', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(count).to.be.equal(0);
        expect(taskCount).to.be.above(1);
        done();
      }, 1000);
    });
  });

  describe('error', function() {
    it('should trigger after each error', function(done) {
      let errorMessage = 'error!';
      let task = function() {
        return Promise.reject(new Error(errorMessage));
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('error', function(error) {
        schedule.stop();
        expect(error.message).to.be.equal(errorMessage);
        done();
      });

      schedule.start();
    });

    it('should trigger after each error (callback)', function(done) {
      let errorMessage = 'error!';
      let task = function(callback) {
        callback(new Error(errorMessage));
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('error', function(error) {
        schedule.stop();
        expect(error.message).to.be.equal(errorMessage);
        done();
      });

      schedule.start();
    });

    it('should not trigger when success', function(done) {
      let taskCount = 0;
      let task = function() {
        taskCount++;
        return Promise.resolve();
      };


      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('error', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(count).to.be.equal(0);
        expect(taskCount).to.be.above(1);
        done();
      }, 1000);
    });

    it('should not trigger when success (callback)', function(done) {
      let taskCount = 0;
      let task = function(callback) {
        taskCount++;
        callback();
      };

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.on('error', function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(count).to.be.equal(0);
        expect(taskCount).to.be.above(1);
        done();
      }, 1000);
    });
  });

  describe('stop', function() {
    it('should trigger when stop immediatelly', function(done) {
      let task = function() {
        return Promise.resolve();
      };

      let schedule =
        execute(task)
          .every(100)
          .stopAfter('1s');

      schedule.on('stop', function() {
        done();
      });

      schedule.start();
    });

    it('should trigger when stop immediatelly (callback)', function(done) {
      let task = function(callback) {
        callback();
      };

      let schedule =
        execute(task)
          .every(100)
          .stopAfter('1s');

      schedule.on('stop', function() {
        done();
      });

      schedule.start();
    });

    it('should trigger when stop', function(done) {
      let task = function() {
        return Promise.resolve();
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('stop', function() {
        done();
      });

      schedule.start();
      schedule.stop();
    });

    it('should trigger when stop (callback)', function(done) {
      let task = function(callback) {
        callback();
      };

      let schedule =
        execute(task)
          .every(100);

      schedule.on('stop', function() {
        done();
      });

      schedule.start();
      schedule.stop();
    });
  });

});
