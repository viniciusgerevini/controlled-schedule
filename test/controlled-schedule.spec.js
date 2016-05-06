'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('Controlled Schedule', function() {
  let sandbox = null;
  // let clock = null

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    // clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    sandbox.restore();
    // clock.restore();
  });

  describe('schedule', function() {
    it('should throw an error if task not provided', function() {
      expect(() => execute() ).to.throw('Task not provided');
    });

    it('should throw an error if task is not a function', function() {
      expect(() => execute('function') ).to.throw('Task has to be a function');
    });

    it('should create schedule when task provided', function() {
      let task = sandbox.stub();
      expect(execute(task)).to.have.property('start');
    });
  });

  describe('#every()', function() {
    it('should repeat task using giving interval', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      let schedule =
        execute(task)
          .every(200)
          .start();

      //TODO FAKE TIMERS
      setTimeout(function() {
        schedule.stop();
        expect(task.calledTwice).to.be.true;
        done();
      }, 300);
    });

    it('should accept duration string', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      let schedule =
        execute(task)
          .every('1s')
          .start();

      //TODO FAKE TIMERS
      this.timeout(5000);
      setTimeout(function() {
        schedule.stop();
        expect(task.callCount).to.be.equal(3);
        done();
      }, 2100);
    });
  });

  describe('#start()', function() {
    it('should start immediatelly', function() {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      let schedule =
        execute(task)
          .every('1s')
          .start();

      schedule.stop();

      expect(task.calledOnce).to.be.true;
    });
  });

  describe('#startIn()', function() {
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

      //TODO FAKE TIMERS
      setTimeout(function() {
        schedule.stop();
        expect(task.calledOnce).to.be.true;
        done();
      }, 1000);
    });
  });

  describe('#stop()', function() {
    it('should stop schedule', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      let schedule =
        execute(task)
          .every('1s')
          .start();

      schedule.stop();

      //TODO USE FAKE TIMERS
      setTimeout(function() {
        expect(task.callCount).to.be.equal(1);
        done();
      }, 1500);
    });
  });

  describe('#stopAfter()', function() {
    it('should stop schedule after given time', function(done) {
      let task = sandbox.stub();
      task.returns(Promise.resolve());

      execute(task)
        .every(450)
        .start()
        .stopAfter('1s');

      //TODO USE FAKE TIMERS
      setTimeout(function() {
        expect(task.callCount).to.be.equal(3);
        setTimeout(function() {
          expect(task.callCount).to.be.equal(3);
          done();
        }, 500);
      }, 1100);
    });
  });
});
