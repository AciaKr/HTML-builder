/* eslint-disable linebreak-style */
const {
  createWriteStream,
  createReadStream,
} = require('node:fs');
const fsPromises = require('fs').promises;
const { stdout } = require('node:process');
const path = require('path');

fsPromises.readdir(path.join(__dirname, 'styles'))
  .then((files) => {
    const writeableStream = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    files.forEach((file) => {
      if (file.includes('.css')) {
        const readableStream = createReadStream(path.join(__dirname, 'styles', file), 'utf8');
        readableStream.pipe(writeableStream);
      }
    });
  })
  .catch((errorFsPromises) => {
    if (errorFsPromises) stdout.write(errorFsPromises);
  });
