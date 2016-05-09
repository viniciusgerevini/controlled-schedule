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
  let stopped = true;
  let callbacks = {};

  function every(duration) {
    milliseconds = isNaN(duration) ? ms(duration) : duration;
    return self;
  }

  function start() {
    stopped = false;
    startSchedule(task, milliseconds);
    return self;
  }

  function startIn(time) {
    stopped = false;
    currentTimeout =
      setTimeout(function() {
        startSchedule(task, milliseconds);
      }, (isNaN(time) ? ms(time) : time));
    return self;
  }

  function stop() {
    clearTimeout(currentTimeout);
    currentTimeout = null;
    stopped = true;

    if (callbacks['stop'])
      callbacks['stop']();

    return self;
  }

  function stopAfter(time) {
    let stopTime = isNaN(time) ? ms(time) : time;

    setTimeout(function() {
      stop();
    }, stopTime);

    return self;
  }

  function startSchedule(task, milliseconds) {
    task()
      .then(function(value) {
        reSchedule(task, milliseconds);
        triggerSuccessCallbacks(value);
      })
      .catch(function (err) {
        reSchedule(task, milliseconds);
        triggerErrorCallbacks(err);
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
