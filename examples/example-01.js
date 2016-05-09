/*eslint no-console: 0 */
'use strict';
const execute = require('../lib/controlled-schedule');
let count = 0;

function task() {
  return new Promise(function(resolve, reject) {
    count++;
    if(count % 10 === 0)
      return reject(new Error(`Problem #${count}`));
    resolve(`Ok! #${count}`);
  });
}

execute(task)
  .every('1s')
  .startIn('2s')
  .stopAfter('1m')
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
    console.log('Finished. It started after 2 seconds and ran once a second.');
    console.log('It should had run 58 times.');
  });
