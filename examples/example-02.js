/*eslint no-console: 0 */
'use strict';
const execute = require('../lib/controlled-schedule');
let count = 0;

function task() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      count++;
      if(count % 3 === 0)
        return reject(new Error(`Problem #${count}`));
      resolve(`Ok! #${count}`);
    }, 10000);
  });
}

execute(task)
  .every('1s')
  .startIn('2s')
  .stopAfter('40s')
  .on('run', function(err, value) {
    console.log(`Task executed ${err} ${value}`);
  })
  .on('success', function(value) {
    console.log(`Nice! ${value}`);
  })
  .on('error', function(err) {
    console.log(`Error: ${err.message}`);
  })
  .on('stop', function() {
    console.log('Stop triggered, but a pending execution must finish');
  });
