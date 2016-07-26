'use strict';
const EVENTS = ['run', 'success', 'error', 'stop'];

module.exports = function() {
  let callbacks = {};

  function setEventCallback(eventName, callback) {
    if (EVENTS.indexOf(eventName) === -1)
      throw new Error(`Event ${eventName} does not exist`);
    callbacks[eventName] = callback;
  }

  function setInternalEventCallback(eventName, callback) {
    callbacks[eventName] = callback;
  }

  function triggerErrorCallbacks(err) {
    if (callbacks['run'])
      callbacks['run'](err);

    if (callbacks['next-run'])
      callbacks['next-run'](err);

    if (callbacks['error'])
      callbacks['error'](err);
  }

  function triggerSuccessCallbacks(value) {
    if (callbacks['run'])
      callbacks['run'](null, value);

    if (callbacks['next-run'])
      callbacks['next-run'](null, value);

    if (callbacks['success'])
      callbacks['success'](value);
  }

  function triggerStopCallback() {
    if (callbacks['stop'])
      callbacks['stop']();
  }

  return {
    setEventCallback,
    setInternalEventCallback,
    triggerErrorCallbacks,
    triggerSuccessCallbacks,
    triggerStopCallback
  };
};
