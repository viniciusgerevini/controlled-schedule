'use strict';
const ms = require('ms');
const EVENTS = ['on', 'run', 'success', 'error', 'stop'];

module.exports = function controlledSchedule(task) {
  if (!task)
    throw new Error('Task not provided');
  if (typeof task !== 'function')
    throw new Error('Task has to be a function');

  return createSchedule(task);
};

function createSchedule(_task) {
  let self = {};
  let task = _task;
  let milliseconds = 0;
  let currentTimeout = null;
  let stopTimeout = null;
  let stopped = true;
  let stopTime;
  let callbacks = {};

  function every(duration) {
    milliseconds = isNaN(duration) ? ms(duration) : duration;
    return self;
  }

  function start() {
    stopped = false;

    if (stopTime) {
      scheduleStop(stopTime);
    }

    startSchedule(task, milliseconds);
    return self;
  }

  function startIn(time) {
    currentTimeout =
      setTimeout(function() {
        start();
      }, (isNaN(time) ? ms(time) : time));
    return self;
  }

  function stop() {
    clearTimeout(currentTimeout);
    clearTimeout(stopTimeout);
    stopTimeout = null;
    currentTimeout = null;
    stopped = true;
    stopTime = null;

    if (callbacks['stop'])
      callbacks['stop']();

    return self;
  }

  function stopAfter(time) {
    stopTime = isNaN(time) ? ms(time) : time;

    if (!stopped)
      scheduleStop(stopTime);

    return self;
  }

  function scheduleStop(time) {
    if(stopTimeout)
      clearTimeout(stopTimeout);

    stopTimeout = setTimeout(function() {
      stop();
    }, time);
  }

  function startSchedule(task, milliseconds) {
    wrapTask(task)
      .then(function(value) {
        reSchedule(task, milliseconds);
        triggerSuccessCallbacks(value);
      })
      .catch(function (err) {
        reSchedule(task, milliseconds);
        triggerErrorCallbacks(err);
      });
  }

  function wrapTask(task) {
    return new Promise(function(resolve, reject) {
      let action = task(function callback(err, value) {
        if(err)
          reject(err);
        else
          resolve(value);
      });

      if (action && typeof action.then === 'function')
        resolve(action);
    });
  }

  function reSchedule(task, milliseconds) {
    if (stopped) return;

    currentTimeout =
      setTimeout(function() {
        startSchedule(task, milliseconds);
      }, milliseconds);
  }

  function triggerSuccessCallbacks(value) {
    if (callbacks['run'])
      callbacks['run'](null, value);

    if (callbacks['success'])
      callbacks['success'](value);
  }

  function triggerErrorCallbacks(err) {
    if (callbacks['run'])
      callbacks['run'](err);

    if (callbacks['error'])
      callbacks['error'](err);
  }

  function on(eventName, callback) {
    if (EVENTS.indexOf(eventName) === -1)
      throw new Error(`Event ${eventName} does not exist`);
    callbacks[eventName] = callback;
    return self;
  }

  Object.assign(self, {
    start,
    startIn,
    every,
    stop,
    stopAfter,
    on
  });

  return self;
}
