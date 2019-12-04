const co = require("co");
const log = require("./log");

const logConsoleOutput = co.wrap(function*(msg) {
  const args = yield msg.args();

  const output = yield Promise.all(
    args.map(arg =>
      arg.executionContext().evaluate(arg => {
        if (arg instanceof Error) return arg.message;
        return arg;
      }, arg)
    )
  );
  log(`Browser console: ${output}`);
});

module.exports = logConsoleOutput;