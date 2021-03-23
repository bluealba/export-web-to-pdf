const defaultOptions = (tempFile, options) => {
  options.pdfSettings = Object.assign(
    {
      printBackground: true,
      landscape: true,
      format: "Letter",
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      preferCSSPageSize: false,
      path: tempFile
    },
    options.pdfSettings
  );

  options.loadingTimeout = options.loadingTimeout || 30000;
  options.ignoreHTTPSErrors = options.ignoreHTTPSErrors || false;
  options.showBrowserConsole = options.showBrowserConsole || false;
  options.extraWaitTime = options.extraWaitTime || 2000;
  options.maxRetries = (options.maxRetries) ? parseInt(options.maxRetries) : 3;

  return options;
};

module.exports = defaultOptions;