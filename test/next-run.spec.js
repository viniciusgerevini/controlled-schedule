'use strict';
var sinon = require('sinon');
const expect = require('chai').expect;
const execute = require('../lib/controlled-schedule');

describe('#nextRun', function() {
  describe('Given schedule for task with Promise', function() {
    let task = null;
    let schedule = null;

    beforeEach(function() {
      task = sinon.stub();
      schedule = execute(task);
    });

    describe('Given Promise for next run was requested', function() {
      let nextRunPromise = null;

      beforeEach(function() {
        nextRunPromise = schedule.nextRun();
      });

      describe('When task executes with success', function() {
        let response = null;
        let expectedResponse = null;

        beforeEach(function() {
          expectedResponse = 'some value';
          task.returns(Promise.resolve(expectedResponse));
          schedule.start();

          return nextRunPromise.then(function(res) {
            response = res;
            schedule.stop();
          });
        });

        it('should resolve promise with given value', function() {
          expect(response).to.equal(expectedResponse);
        });
      });

      describe('When task executes with error', function() {
        let response = null;
        let expectedError = null;

        beforeEach(function() {
          expectedError = new Error('some error');
          task.returns(Promise.reject(expectedError));
          schedule.start();

          return nextRunPromise.catch(function(err) {
            response = err;
            schedule.stop();
          });
        });

        it('should reject promise with given error', function() {
          expect(response).to.equal(expectedError);
        });
      });
    });
  });

  describe('Given schedule for task with callback', function() {
    let task = null;
    let schedule = null;

    beforeEach(function() {
      task = sinon.stub();
      schedule = execute(task);
    });

    describe('Given Promise for next run was requested', function() {
      let nextRunPromise = null;

      beforeEach(function() {
        nextRunPromise = schedule.nextRun();
      });

      describe('When task executes with success', function() {
        let response = null;
        let expectedResponse = null;

        beforeEach(function() {
          expectedResponse = 'some value';
          task.yields(null, expectedResponse);
          schedule.start();

          return nextRunPromise.then(function(res) {
            response = res;
            schedule.stop();
          });
        });

        it('should return given value', function() {
          expect(response).to.equal(expectedResponse);
        });
      });

      describe('When task executes with error', function() {
        let response = null;
        let expectedError = null;

        beforeEach(function() {
          expectedError = new Error('some error');
          task.yields(expectedError);
          schedule.start();

          return nextRunPromise.catch(function(err) {
            response = err;
            schedule.stop();
          });
        });

        it('should return given error', function() {
          expect(response).to.equal(expectedError);
        });
      });
    });
  });
});
