'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('Events', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#afterEachRun()', function() {
    it('should trigger after each execution finishes', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.afterEachRun(function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(task.callCount).to.be.equal(count);
        done();
      }, 1000);
    });

    it('should pass value to callback', function(done) {
      let taskReturn = 'this is the task value';
      let task = sandbox.stub();
      task.returns(Promise.resolve(taskReturn));

      let schedule =
        execute(task)
          .every(100);

      schedule.afterEachRun(function(err, value) {
        schedule.stop();
        if(err)
          return done('should not throw an error');

        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should pass error when fails', function(done) {
      let errorMessage = 'this is an error!';
      let task = sandbox.stub();
      task.returns(Promise.reject(new Error(errorMessage)));

      let schedule =
        execute(task)
          .every(100);

      schedule.afterEachRun(function(err, value) {
        schedule.stop();
        if(err) {
          expect(err.message).to.be.equal(errorMessage);
          expect(value).to.be.undefined;
          return done();
        }

        done('should get an error');
      });

      schedule.start();
    });
  });

  describe('#afterEachSuccess()', function() {
    it('should trigger after each success', function(done) {
      let taskReturn = 'success!';
      let task = sandbox.stub();
      task.returns(Promise.resolve(taskReturn));

      let schedule =
        execute(task)
          .every(100);

      schedule.afterEachSuccess(function(value) {
        schedule.stop();
        expect(value).to.be.equal(taskReturn);
        done();
      });

      schedule.start();
    });

    it('should not trigger after error', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.reject());

      let schedule =
        execute(task)
          .every(100);

      let count = 0;

      schedule.afterEachSuccess(function() {
        count++;
      });

      schedule.start();

      setTimeout(function() {
        schedule.stop();
        expect(count).to.be.equal(0);
        expect(task.callCount).to.be.above(0);
        done();
      }, 1000);
    });
  });

});
