"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const uuid = require("uuid");

const getTempDir = () => {
  return new Promise((resolve, reject) => {
    fs.realpath(os.tmpdir(), (err, resolvedPath) => {
      if (err) return reject(err);

      resolve(resolvedPath);
    });
  });
};

const getTempFile = ext => {
  return getTempDir().then(tempDir => path.join(tempDir, uuid.v4() + (ext || "")));
};

const readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
};

const deleteFile = filename => {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
};

const fileExists = filename => {
  return new Promise((resolve, reject) => {
    fs.exists(filename, resolve);
  })
};

module.exports = {
  getTempDir,
  getTempFile,
  readFile,
  deleteFile,
  fileExists
};