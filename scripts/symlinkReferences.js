import * as fs from "fs";
import path from "path";

const SOURCE_DIR = `${process.cwd()}/docs/md-docs`;
const DEST_DIR = `${process.cwd()}/src/content/references`;
const EXCLUDE_EXT = 'json'; // Specify the extension to exclude

function copyFiles(srcDir, destDir, excludeExt) {
  fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${srcDir}:`, err);
      return;
    }

    files.forEach(file => {
      const srcPath = path.join(srcDir, file.name);
      const destPath = path.join(destDir, file.name);

      if (file.isDirectory()) {
        fs.mkdir(destPath, { recursive: true }, err => {
          if (err) {
            console.error(`Error creating directory ${destPath}:`, err);
            return;
          }
          copyFiles(srcPath, destPath, excludeExt); // Recursively handle subdirectories
        });
      } else {
        if (path.extname(file.name) !== `.${excludeExt}`) {
          fs.copyFile(srcPath, destPath, err => {
            if (err) {
              console.error(`Error copying from ${srcPath} to ${destPath}:`, err);
            } else {
              console.log(`File created: ${srcPath} -> ${destPath}`);
            }
          });
        }
      }
    });
  });
}

fs.mkdir(DEST_DIR, { recursive: true }, err => {
  if (err) {
    console.error(`Error creating destination directory ${DEST_DIR}:`, err);
  } else {
    copyFiles(SOURCE_DIR, DEST_DIR, EXCLUDE_EXT);
  }
});
