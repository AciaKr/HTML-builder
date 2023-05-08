/* eslint-disable linebreak-style */
const {
  copyFile,
  mkdir,
  readdir,
} = require('node:fs');
const fsPromises = require('fs').promises;
const { stdout } = require('node:process');
const path = require('path');

let filesCopy = [];

function getCurrentFileNames() {
  readdir(__dirname, (_error, filesDirectory) => {
    if (_error) stdout.write(_error);
    if (filesDirectory.includes('files-copy')) {
      readdir(path.join(__dirname, 'files-copy'), (error, filesCopyNames) => {
        if (error) stdout.write(error);
        else {
          filesCopy = filesCopyNames;
        }
      });
    }
  });
}

getCurrentFileNames();

mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (errorMkdir) => {
  if (errorMkdir) stdout.write(errorMkdir);
  else {
    readdir(
      path.join(__dirname, 'files'),
      (error, files) => {
        if (error) stdout.write(error);
        else {
          filesCopy.forEach((fileCopy) => {
            fsPromises.rm(path.join(__dirname, 'files-copy', fileCopy))
              .then(() => {
                files.forEach((file) => {
                  copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (errorCopyFile) => {
                    if (errorCopyFile) throw errorCopyFile;
                  });
                });
              })
              .catch((errorFsPromises) => {
                if (errorFsPromises) stdout.write(errorFsPromises);
              });
          });
          files.forEach((file) => {
            copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (errorCopyFile) => {
              if (errorCopyFile) throw errorCopyFile;
            });
          });
        }
      },
    );
  }
});
