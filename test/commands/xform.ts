import Xform from "lib/commands/xformCommand";
import { runCommand, testifyCommand } from "./helper";
import { testFile } from "test/testSetup";

describe("Xform Command", () => {
  let TestXform = testifyCommand(Xform);

  it("should instantiate xform command", async () => {
    const lastCommand = runCommand(
      ["xform", 'r.b = "foo"', testFile("simple.recs")],
      TestXform
    );

    let records = await TestXform.lastCommand.donePromise;

    expect(lastCommand).to.be.instanceof(Xform);
    expect(records).to.be.records([
      { a: 1, b: "foo" },
      { a: 2, b: "foo" },
    ]);
  });

  it("should allow global variables", async () => {
    const lastCommand = runCommand(
      [
        "xform",
        "global.count ??=0; count++; r.b = count",
        testFile("simple.recs"),
      ],
      TestXform
    );

    let records = await TestXform.lastCommand.donePromise;

    expect(lastCommand).to.be.instanceof(Xform);
    expect(records).to.be.records([
      { a: 1, b: 1 },
      { a: 2, b: 2 },
    ]);
  });
});
