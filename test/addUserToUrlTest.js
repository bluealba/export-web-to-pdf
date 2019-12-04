const expect = require("chai").expect;
const addUserToUrl = require("../src/lib/addUserToUrl");

describe("addUserToUrlTest", function () {
  it("should correctly add username and password to a URL", () => {
    let target = addUserToUrl("http://example.org/hello", {
      username: "hello",
      password: "world"
    });

    expect(target).to.equal("http://hello:world@example.org/hello")
  });

  it("should throw if user is not fully specified", () => {
    let assignNullUser = () => {
      let target = addUserToUrl("http://example.org/hello", null);
    };
    expect(assignNullUser).to.throw();
  });
});