const Xform = prequire("lib/commands/xformCommand"); // Must require in order to get it to register
const Command = prequire("lib/command");
const { runCommand, testifyCommand } = require("./helper");
const { testFile } = prequire("test/testSetup");

describe("Xform Command", () => {
  testifyCommand(Xform);

  it("should instantiate xform command", async () => {
    const lastCommand = runCommand([
      "xform",
      'r.a = "foo"',
      testFile("simple.recs"),
    ]);

    let records = await lastCommand.donePromise;
    console.log("test", records);

    expect(lastCommand).to.be.instanceof(Xform);
    expect();
  });
});
