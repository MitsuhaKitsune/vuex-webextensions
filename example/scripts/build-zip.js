#!/usr/bin/env node

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

const extractExtensionData = () => {
  const extPackageJson = require('../package.json');

  return {
    name: extPackageJson.name,
    version: extPackageJson.version,
  };
};

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR);
  }
};

const main = () => {
  const { name, version } = extractExtensionData();
  const zipFilename = `${name}-v${version}.zip`;

  makeDestZipDirIfNotExists();

  var output = fs.createWriteStream(path.join(DEST_ZIP_DIR, zipFilename));
  var archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.info(err);
    } else {
      // throw error
      throw err;
    }
  });

  archive.pipe(output);
  archive.directory(DIST_DIR, false);
  archive.finalize();
  console.info('OK');
};

main();
