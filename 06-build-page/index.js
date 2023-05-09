/* eslint-disable linebreak-style */
const {
  stat,
  mkdir,
  rm,
  readdir,
  readFile,
  copyFile,
  createWriteStream,
  createReadStream,
} = require('node:fs');
const fsPromises = require('fs').promises;
const { stdout } = require('node:process');
const path = require('path');

async function makeDirectory(dir) {
  let directoryNameOut = path.join(__dirname, 'project-dist', 'assets', dir);
  let directoryNameIn = path.join(__dirname, 'assets', dir);
  if (dir === 'assets') {
    directoryNameOut = path.join(__dirname, 'project-dist', 'assets');
    directoryNameIn = path.join(__dirname, 'assets');
  }
  fsPromises.mkdir(directoryNameOut)
    .then(() => {
      readdir(
        directoryNameIn,
        { withFileTypes: true },
        (error, files) => {
          if (error) stdout.write(error);
          else {
            files.forEach((file) => {
              stat(
                path.join(directoryNameIn, file.name),
                (error1, stats) => {
                  if (error1) stdout.write(error1);
                  else if (stats.isFile()) {
                    fsPromises.rm(
                      path.join(directoryNameOut, file.name),
                      { recursive: true, force: true },
                    )
                      .then(() => {
                        copyFile(
                          path.join(directoryNameIn, file.name),
                          path.join(directoryNameOut, file.name),
                          (errorCopyFile) => {
                            if (errorCopyFile) stdout.write(errorCopyFile);
                          },
                        );
                      })
                      .catch((errorFsPromises) => {
                        if (errorFsPromises) {
                          stdout.write(errorFsPromises);
                        }
                      });
                  } else if (stats.isDirectory()) {
                    makeDirectory(file.name).catch(console.error);
                  }
                },
              );
            });
          }
        },
      );
    })
    .catch((errorFsPromises) => {
      if (errorFsPromises) {
        rm(
          directoryNameOut,
          { recursive: true, force: true },
          (errorRmdir) => {
            stdout.write('errorRmdir', errorRmdir);
            makeDirectory(dir);
          },
        );
      }
    });
}

mkdir(
  path.join(__dirname, 'project-dist'),
  { recursive: true },
  (errorMkdir) => {
    if (errorMkdir) stdout.write(errorMkdir);
    makeDirectory('assets').catch(console.error);
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
