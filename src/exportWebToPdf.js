"use strict";
const co = require("co");
const puppeteer = require("puppeteer");
const { TimeoutError } = require("puppeteer/Errors");
const redact = require("./lib/redact");
const log = require("./lib/log");
const getTempFile = require("./lib/fileUtils").getTempFile;
const readFile = require("./lib/fileUtils").readFile;
const deleteFile = require("./lib/fileUtils").deleteFile;
const fileExists = require("./lib/fileUtils").fileExists;
const addUserToUrl = require("./lib/addUserToUrl.js");
const defaultOptions = require("./lib/defaultOptions");
const logConsoleOutput = require("./lib/logConsoleOutput");

// These are common locations for Chrome on Docker images like the `alpine` and `node`.
// In those cases it makes sense not to download Chrome from puppeteer and use the distro version
const EXISTING_CHROME_PATHS = [
  "/usr/bin/google-chrome-unstable",
  "/usr/bin/chromium-browser"
];
const EXTRA_WAIT_TIME = 2000; //TODO: configurable
const MAX_RETRIES = 3;

const exportWebToPdf = co.wrap(function*(url, options = {}) {
  log(`Exporting ${url} content to pdf`);
  let chromeExec;
  let browser;

  for (let chromePath of EXISTING_CHROME_PATHS) {
    let pathExists = yield fileExists(chromePath);
    if (pathExists) {
      log(`Found Chrome on ${chromePath}`);
      chromeExec = chromePath;
    }
  }

  try {
    let tempFile = yield getTempFile(".pdf");
    options = defaultOptions(tempFile, options);

    log(
      `Generating export PDF tempDir=${tempFile} url=${url} options=${JSON.stringify(
        options
      )}`
    );

    if (options.auth) {
      url = addUserToUrl(url, options.auth);
    }

    const browserOptions = {
      args: ["--no-sandbox", "--font-render-hinting=none"],
      ignoreHTTPSErrors: options.ignoreHTTPSErrors,
      executablePath: chromeExec ? chromeExec : undefined
    };

    browser = yield puppeteer.launch(browserOptions);
    const page = yield browser.newPage();

    if (options.showBrowserConsole) {
      page.on("console", logConsoleOutput);
    }

    if (options.viewportSettings) {
      yield page.setViewport(options.viewportSettings);
    }

    log("Navigating to URL...");
    const response = yield page.goto(url, { timeout: options.loadingTimeout });
    log(`URL responded with status ${response.status()}.`);

    if (!response.ok()) {
      throw new Error(
        `URL responded with status ${response.status()} ${response.statusText()}.`
      );
    }

    if (options.waitForSelectors && options.waitForSelectors.length > 0) {
      let loading = true;
      let retries = 0;
      log("Waiting for css selectors to load...");
      do {
        retries++;
        yield Promise.all(
          options.waitForSelectors.map(selector =>
            page.waitFor(selector, { timeout: options.loadingTimeout })
          )
        )
          .then(() => {
            loading = false;
            log(`Found CSS selectors during try number ${retries}.`);
          })
          .catch(e => {
            if (retries === MAX_RETRIES) {
              log("Error waiting for page selectors.");
              throw e;
            }
            log(
              `Couldn't find selectors during try number ${retries}. Trying again...`
            );
            if (options.screenshotPath) {
              log(`Saving screenshot path=${options.screenshotPath}`);
              let now = new Date();
              page.screenshot({
                path: `${
                  options.screenshotPath
                }/screenshot_${now.toLocaleDateString()}_${now.toLocaleTimeString()}.png`,
                fullPage: true
              });
            }
          });
      } while (loading);
    }

    yield new Promise(resolve => setTimeout(resolve, EXTRA_WAIT_TIME));

    log(`Generating PDF file with options=${JSON.stringify(options.pdfSettings)}`);
    yield page.emulateMedia("print");
    yield page.pdf(options.pdfSettings);

    log("Reading PDF file generated");
    let pdfData = yield readFile(tempFile);

    log(`Deleting temp PDF file filename=${tempFile}`);
    yield deleteFile(tempFile);

    log(url);
    log(redact(url, "***"));
    log(`Exported content to PDF url=${redact(url, "***")}`);

    return pdfData;
  } catch (e) {
    if (e instanceof TimeoutError) {
      log("Error: PDF generation timed out", e);
    } else {
      log("Error: Failed to export.");
    }

    log(e);

    throw new Error("Failed to export PDF file");
  } finally {
    if (browser) {
      browser.close();
    }
  }
});

module.exports = exportWebToPdf;
