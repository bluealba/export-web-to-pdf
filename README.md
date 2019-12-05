# export-web-to-pdf

Node.js lib to export any web page to PDF.

## Installation

```shell script
npm install export-web-to-pdf
```

## Usage

```js
const exportWebToPdf = require("export-web-to-pdf");

exportWebToPdf("http://www.example.com", exportOptions)
    .then(data => {
      // .. do something with PDF data, like saving to a file or upload to S3 ..
    });
```

See the `sample/` folder for a running example.

## API

`let response = exportWebToPdf(url, options);`

#### Parameters

`url` (string) URL you want converted to PDF

`options` (object) An options object containing custom settings. The possible options are:

* `loadingTimeout`: Maximum amount of time to wait for navigation to finish. Defaults to `30000`.
* `auth.username`
* `auth.password`: Adds username and password to the request.
* `ignoreHTTPSErrors`: Whether to ignore HTTPS errors during navigation. Defaults to `false`.
* `showBrowserConsole`: Whether to log the browser's console messages. Defaults to `false`.
* `waitForSelectors`: Array of CSS selectors. If defined, it will wait until all CSS selector are found in the page before continuing.
* `screenshotPath`: If defined saves a screenshot of the navigated URL. This only works when `waitForSelectors` are not found on the page, as a debugging tool.
* `pdfSettings`: Options object with PDF settings. Chech [Puppeteers's documentation](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagepdfoptions) for details.

#### Return value

A `Promise` that resolves to a `Buffer` with the PDF content.