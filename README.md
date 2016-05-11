# Controlled schedule

[![Build Status](https://travis-ci.org/viniciusgerevini/controlled-schedule.svg?branch=master)](https://travis-ci.org/viniciusgerevini/controlled-schedule)
[![Coveralls](https://img.shields.io/coveralls/viniciusgerevini/controlled-schedule.svg?maxAge=2592000)](https://coveralls.io/github/viniciusgerevini/controlled-schedule?branch=master)

Recurring schedule for async tasks. Schedule next execution only after the current one finishes.

e.g:

```javascript
const execute = require('controlled-schedule');

function task() {
  // some async operation
  // should accept a callback as parameter
  // or return a Promise
}

execute(task)
  .every('20s')
  .startIn('1m')
  .stopAfter('2h')
  .on('error', function(err) {
    // log error
  })
  .on('stop', function() {
    // do something
  });
```
For more examples check `/examples` folder.

## Instalation

`npm install controlled-schedule --save`

## Usage


- Your task must return a `Promise` or accept a `callback(err, value)` as argument.

- Methods accept time in milliseconds or in string format.
e.g. '10 days', '10d', '10h', '2.5 hrs', '10h', '10m', '10s'

- Every method returns the object reference so you can chain all operations.

Usage:

```javascript
const execute = require('controlled-schedule');

//create schedule object
let schedule = execute(task);

// define interval between each execution
schedule.every('20s');

// define how long to start the first execution
schedule.startIn('1m');

// start immediately
schedule.start();

// define how long the task will be rescheduled
schedule.stopAfter('2h');

// stop the schedule (waits for task to finish if it's executing)
schedule.stop();

// events

// after a task runs
// err - error object passed by the task
// value - value returned by the task
schedule.on('run', function(err, value) {

});

// after a task runs with success
// value - value returned by the task
schedule.on('success', function(value) {

});

// after a task runs and return an error
// err - error object returned by the task
schedule.on('error', function(err) {

});

// when schedule stop is triggered
schedule.on('stop', function() {

});

```

### More examples

Run task indefinitely with 1 hour interval between executions:
```javascript
execute(task)
  .every('1h')
  .start();
```

Run for 1 minute starting next task immediately after current one finishes:
```javascript
execute(task)
  .stopAfter('1m')
  .start();
```

Run task with 1 minute interval and stop if an error occurred:
```javascript
let schedule =
  execution(task)
    .every('1m')
    .on('error', function(err) {
      schedule.stop();
      console.log(err);
    })
    .start()
```

## License

MIT
