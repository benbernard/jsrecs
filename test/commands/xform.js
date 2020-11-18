const Xform = prequire("lib/commands/xformCommand"); // Must require in order to get it to register
const Command = prequire("lib/command");
const { runCommand } = require("./helper");
const { testFile } = prequire("test/testSetup");

describe("Xform Command", () => {
  it("should instantiate xform command", () => {
    const lastCommand = runCommand([
      "xform",
      'r.a = "foo"',
      testFile("simple.recs"),
    ]);

    expect(lastCommand).to.be.instanceof(Xform);
  });
});
