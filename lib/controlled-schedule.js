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
      .then(function() {
        if(stopped) return;

        currentTimeout =
          setTimeout(function() {
            startSchedule(task, milliseconds);
          }, milliseconds);
      });
  }

  self.start = start;
  self.every = every;
  self.stop = stop;
  self.startIn = startIn;
  self.stopAfter = stopAfter;

  return self;
}
