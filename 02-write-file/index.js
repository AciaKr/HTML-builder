/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const EventEmitter = require('events');

const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });
const emitter = new EventEmitter();

emitter.on('exit', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
});

output.write('Input our text: \n');
let data = '';
const writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.on('line', (answer) => {
  emitter.emit('exit', answer);
  writeableStream.write(`${data += answer} `);
});

process.on('exit', () => output.write('Good luck!'));
