const fs = require("fs");
const exportWebToPdf = require("../");

exportWebToPdf("http://www.example.com", {
  waitForSelectors: ["body"],
  pdfSettings: {},
  ignoreHTTPSErrors: true,
  showBrowserConsole: true
}).then(data => {
  fs.writeFileSync("output.pdf", data);
});