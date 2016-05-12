'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const eventHandler = require('../lib/event-handler');

describe('Event handler', function() {
  let handler = null;
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    handler = eventHandler();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should set callback only for valid events', function() {
    let callback = () => null;
    handler.setEventCallback('run', callback);
    handler.setEventCallback('success', callback);
    handler.setEventCallback('error', callback);
    handler.setEventCallback('stop', callback);
    expect(() =>
      handler.setEventCallback('wrong', callback)
    ).to.throw('Event wrong does not exist');
  });

  it('should trigger only success related callbacks', function() {
    let runCallback = sandbox.stub();
    let successCallback = sandbox.stub();
    let errorCallback = sandbox.stub();
    let stopCallback = sandbox.stub();

    handler.setEventCallback('run', runCallback);
    handler.setEventCallback('success', successCallback);
    handler.setEventCallback('error', errorCallback);
    handler.setEventCallback('stop', stopCallback);

    handler.triggerSuccessCallbacks();

    sinon.assert.called(runCallback);
    sinon.assert.called(successCallback);
    sinon.assert.notCalled(errorCallback);
    sinon.assert.notCalled(stopCallback);
  });

  it('should trigger only error related callbacks', function() {
    let runCallback = sandbox.stub();
    let successCallback = sandbox.stub();
    let errorCallback = sandbox.stub();
    let stopCallback = sandbox.stub();

    handler.setEventCallback('run', runCallback);
    handler.setEventCallback('success', successCallback);
    handler.setEventCallback('error', errorCallback);
    handler.setEventCallback('stop', stopCallback);

    handler.triggerErrorCallbacks();

    sinon.assert.called(runCallback);
    sinon.assert.notCalled(successCallback);
    sinon.assert.called(errorCallback);
    sinon.assert.notCalled(stopCallback);
  });

  it('should trigger stop callback', function() {
    let stopCallback = sandbox.stub();
    handler.setEventCallback('stop', stopCallback);

    handler.triggerStopCallback();

    sinon.assert.called(stopCallback);
  });

  it('should trigger success callback with passed value', function() {
    let value = 'some value';
    let callback = sandbox.stub();
    handler.setEventCallback('success', callback);

    handler.triggerSuccessCallbacks(value);

    sinon.assert.calledWith(callback, value);
  });

  it('should trigger run callback with passed value and no error', function() {
    let value = 'some value';
    let callback = sandbox.stub();
    handler.setEventCallback('run', callback);

    handler.triggerSuccessCallbacks(value);

    sinon.assert.calledWith(callback, null, value);
  });

  it('should trigger run callback with error', function() {
    let error = new Error('some error');
    let callback = sandbox.stub();
    handler.setEventCallback('run', callback);

    handler.triggerErrorCallbacks(error);

    sinon.assert.calledWith(callback, error);
  });

  it('should trigger error callback with error informed', function() {
    let error = new Error('some error');
    let callback = sandbox.stub();
    handler.setEventCallback('error', callback);

    handler.triggerErrorCallbacks(error);

    sinon.assert.calledWith(callback, error);
  });
});
