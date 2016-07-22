'use strict';
const ms = require('ms');
const eventHandler = require('./event-handler');

module.exports = function controlledSchedule(task) {
  if (!task)
    throw new Error('Task not provided');
  if (typeof task !== 'function')
    throw new Error('Task has to be a function');

  return createSchedule(task);
};

function convertTime(time) {
  return isNaN(time) ? ms(time) : time;
}

function createSchedule(_task) {
  let self = {};
  let task = _task;
  let milliseconds = 0;
  let currentTimeout = null;
  let stopTimeout = null;
  let stopped = true;
  let stopTime;
  let eventsHandler = eventHandler();

  function every(time) {
    milliseconds = convertTime(time);
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
      }, convertTime(time));
    return self;
  }

  function stop() {
    clearTimeout(currentTimeout);
    clearTimeout(stopTimeout);
    stopTimeout = null;
    currentTimeout = null;
    stopped = true;
    stopTime = null;

    eventsHandler.triggerStopCallback();

    return self;
  }

  function stopAfter(time) {
    stopTime = convertTime(time);

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
        eventsHandler.triggerSuccessCallbacks(value);
      })
      .catch(function (err) {
        reSchedule(task, milliseconds);
        eventsHandler.triggerErrorCallbacks(err);
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

  function on(eventName, callback) {
    eventsHandler.setEventCallback(eventName, callback);
    return self;
  }

  function nextRun() {
    return new Promise(function(resolve, reject) {
      eventsHandler.setInternalEventCallback('next-run', function(err, value) {
        if (err)
          return reject(err);
        resolve(value);
      });
    });
  }

  Object.assign(self, {
    start,
    startIn,
    every,
    stop,
    stopAfter,
    on,
    nextRun
  });

  return self;
}
