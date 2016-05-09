'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const execute = require('../lib/controlled-schedule');

describe('#stopAfter()', function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should stop schedule after given time', function(done) {
    let task = sandbox.stub();
    task.returns(Promise.resolve());

    execute(task)
      .every(450)
      .start()
      .stopAfter('1s');

    setTimeout(function() {
      expect(task.callCount).to.be.equal(3);
      setTimeout(function() {
        expect(task.callCount).to.be.equal(3);
        done();
      }, 500);
    }, 1100);
  });
});
