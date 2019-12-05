const fs = require("fs");
const os = require("os");
const chai = require("chai");
const expect = require("chai").expect;
const sinon = require("sinon");
const fileUtils = require("../src/lib/fileUtils");

chai.use(require("chai-string"));

describe("fileUtilsTest", function() {
  beforeEach(() => {
    sinon.replace(os, "tmpdir", sinon.fake.returns("/some/temp/path"));
    sinon.replace(fs, "readFile", (filename, callback) => callback(null, new Buffer("hello world")));
    sinon.replace(fs, "unlink", (filename, callback) => callback(null));
    sinon.replace(fs, "exists", (filename, callback) => callback(true));
  });

  afterEach(() => sinon.restore());

  it("should return a temp dir successfully", done => {
    sinon.replace(fs, "realpath", (tempDir, callback) => callback(null, tempDir));

    fileUtils.getTempDir()
      .then(tempDir => {
        expect(tempDir).to.equal("/some/temp/path");
        done();
      })
      .catch(done)
  });

  it("should reject if it fails to get a temp dir", done => {
    sinon.replace(fs, "realpath", (tempDir, callback) => callback(new Error("unable to get real path")));

    fileUtils.getTempDir()
      .then(tempDir => {
        done(new Error("expected to fail"));
      })
      .catch((e) => done())
  });

  it("should return a temp file with a uuid filename and the specified extension", done => {
    sinon.replace(fs, "realpath", (tempDir, callback) => callback(null, tempDir));
    let extension = ".pdf";

    fileUtils.getTempFile(extension)
      .then(tempFile => {
        expect(tempFile).to.startWith("/some/temp/path");
        expect(tempFile).to.endWith(extension);
        done();
      })
      .catch(done)
  });

  it("should return a promise that reads a file and returns when done with the content", done => {
    fileUtils.readFile("/some/file")
      .then(data => {
        expect(data).to.exist;
        expect(data).to.be.an.instanceOf(Buffer);
        done();
      })
      .catch(done)
  });

  it("should delete an existing file", done => {
    fileUtils.deleteFile("/some/file")
      .then(() => done())
      .catch(done)
  });

  it("should check that a file exists", done => {
    fileUtils.fileExists("/some/file")
      .then(exists => {
        expect(exists).to.be.true;
        done();
      })
      .catch(done)
  })

});
