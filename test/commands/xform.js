const Xform = prequire("lib/commands/xformCommand"); // Must require in order to get it to register
const Command = prequire("lib/command");
const { runCommand, testifyCommand } = require("./helper");
const { testFile } = prequire("test/testSetup");

describe("Xform Command", () => {
  testifyCommand(Xform);

  it("should instantiate xform command", async () => {
    const lastCommand = runCommand([
      "xform",
      'r.b = "foo"',
      testFile("simple.recs"),
    ]);

    let records = await lastCommand.donePromise;

    expect(lastCommand).to.be.instanceof(Xform);
    expect(records).to.be.records([
      { a: 1, b: "foo" },
      { a: 2, b: "foo" },
    ]);
  });

  it("should allow global variables", async () => {
    const lastCommand = runCommand([
      "xform",
      "global.count ??=0; count++; r.b = count",
      testFile("simple.recs"),
    ]);

    let records = await lastCommand.donePromise;

    expect(lastCommand).to.be.instanceof(Xform);
    expect(records).to.be.records([
      { a: 1, b: 1 },
      { a: 2, b: 2 },
    ]);
  });
});
