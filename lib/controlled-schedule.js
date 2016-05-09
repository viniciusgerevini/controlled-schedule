'use strict';
const ms = require('ms');

module.exports = function controlledSchedule(task) {
  if(!task)
    throw new Error('Task not provided');
  if(typeof task !== 'function')
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
        if(callbacks['afterEachRun'])
          callbacks['afterEachRun'](null, value);

        if(stopped) return;

        currentTimeout =
          setTimeout(function() {
            startSchedule(task, milliseconds);
          }, milliseconds);
      })
      .catch(function(err) {
        if(callbacks['afterEachRun'])
          callbacks['afterEachRun'](err);
      });
  }

  function afterEachRun(callback) {
    callbacks['afterEachRun'] = callback;
  }

  Object.assign(self, {
    start,
    startIn,
    every,
    stop,
    stopAfter,
    afterEachRun
  });

  return self;
}
