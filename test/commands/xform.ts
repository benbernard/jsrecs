import "lib/commands/xformCommand";
import { runCommand, setupCommandTest } from "./helper";
import { testFile } from "test/testSetup";

describe("Xform Command", () => {
  let result = setupCommandTest();

  it("should run xform command", async () => {
    await runCommand(["xform", 'r.b = "foo"', testFile("simple.recs")]);

    expect(await result.records()).to.be.records([
      { a: 1, b: "foo" },
      { a: 2, b: "foo" },
    ]);
  });

  it("should allow global variables", async () => {
    await runCommand([
      "xform",
      "global.count ??= 0; count++; r.b = count",
      testFile("simple.recs"),
    ]);

    expect(await result.records()).to.be.records([
      { a: 1, b: 1 },
      { a: 2, b: 2 },
    ]);
  });
});
