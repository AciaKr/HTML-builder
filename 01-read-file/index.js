/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');
const readableFile = fs.createReadStream(pathFile, 'utf-8');
readableFile.on('data', (chunk) => console.log(chunk));
