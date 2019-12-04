const expect = require("chai").expect;
const logConsoleOutput = require("../src/lib/logConsoleOutput");

describe("logConsoleOutputText", function() {
  it("should correctly log the message given", () => {
    let target = () => {
      let msg = {
        args: () => {
          return Promise.resolve([
            {
              executionContext: () => {
                return {
                  evaluate: (fn, arg) => {
                    return Promise.resolve(fn("hola"));
                  }
                };
              }
            },{
              executionContext: () => {
                return {
                  evaluate: (fn, arg) => {
                    let error = new Error();
                    error.message = "error message";

                    return Promise.resolve(fn(error));
                  }
                };
              }
            }
          ]);
        }
      };

      logConsoleOutput(msg)
        .then(() => {})
        .catch(e => {
          throw e;
        });
    };

    expect(target).not.to.throw();
  });
});
