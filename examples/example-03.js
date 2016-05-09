/*eslint no-console: 0 */
'use strict';
const execute = require('../lib/controlled-schedule');
let count = 0;

function task() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(count++);
    }, 1000 * count);
  });
}

let schedule =
  execute(task)
  .every('1s');

schedule.on('run', function(err, value) {
  console.log(`Each execution takes one second more ${err} ${value}`);
  if(value === 5)
    schedule.stop();
});

schedule.on('stop', function() {
  console.log(':)');
});

schedule.start();
