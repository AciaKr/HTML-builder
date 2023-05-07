/* eslint-disable linebreak-style */
const fs = require('fs');
const path = require('path');
const { stdout } = require('node:process');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    stdout.write('Secret-folder directory files: \n');
    if (err) stdout.write(err);
    else {
      files.forEach((file) => {
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
          if (err) stdout.write(error);
          else if (stats.isFile()) {
            const fileName = file.name.split('.');
            stdout.write(`${fileName[0]} - ${fileName[1]} - ${Math.floor(((stats.size / 1024) * 100)) / 100} kB \n`);
          }
        });
      });
    }
  },
);
