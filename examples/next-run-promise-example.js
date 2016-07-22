/*eslint no-console: 0 */
'use strict';
const execute = require('../lib/controlled-schedule');

let resultFirstTask = null;
let resultSecondTask = null;

function firstTask(callback) {
  console.log('Fist task executing.');
  resultFirstTask = 'first task was executed';

  callback(null, 'Hello');
}

function secondTask() {
  console.log('Second task executing');
  resultSecondTask = 'second task was executed';
  return Promise.resolve('World!');
}

function thirdTask() {
  let response = `Third task only started after ${resultFirstTask} and ${resultSecondTask}`;
  return Promise.resolve(response);
}

let firstSchedule = execute(firstTask).every('1m').stopAfter('1s');
let secondSchedule = execute(secondTask).every('1m').stopAfter('1s');
let thirdSchedule = execute(thirdTask).every('10s');

Promise.all([
  firstSchedule.nextRun(),
  secondSchedule.nextRun()
]).then(function(results) {
  console.log(results.join(' '));

  thirdSchedule
    .start()
    .nextRun()
      .then(function(result) {
        console.log(result);
        thirdSchedule.stop();
      });
});

firstSchedule.start();
secondSchedule.startIn('2s');
