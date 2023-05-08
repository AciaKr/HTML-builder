/* eslint-disable linebreak-style */
const {
  mkdir,
  readdir,
  readFile,
  createWriteStream,
  createReadStream,
} = require('node:fs');
const fsPromises = require('fs').promises;
const { stdout } = require('node:process');
const path = require('path');

mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive: true },
  (errorMkdir) => {
    if (errorMkdir) stdout.write(errorMkdir);
  },
);

readFile(
  path.join(__dirname, 'template.html'),
  'utf-8',
  (err, data) => {
    if (err) throw err;
    let template = data;
    readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
      (error, files) => {
        if (error) throw error;
        const componentObj = {};
        files.forEach((file) => {
          let fileName = '';
          readFile(
            path.join(__dirname, 'components', file.name),
            'utf-8',
            (error1, content) => {
              if (error1) throw error1;
              else if (file.name.includes('.html')) {
                fileName = file.name.split('.');
                componentObj[fileName[0]] = content;
              }
              const buffer = template.replace(`{{${fileName[0]}}}`, componentObj[fileName[0]]);
              template = buffer;
              const writeableStream = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
              writeableStream.write(template);
            },
          );
        });
      },
    );
  },
);

fsPromises.readdir(path.join(__dirname, 'styles'))
  .then((files) => {
    const writeableStream = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
