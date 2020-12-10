import "lib/commands/xformCommand";
import { runCommand, setupCommandTest, BailError } from "./helper";
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

  it("should error once on snippet syntax error", async () => {
    await expect(
      runCommand(["xform", "r.a + ", testFile("simple.recs")])
    ).to.be.rejectedWith(BailError, "Unexpected token");

    expect(result.consoleLines).to.deep.equal([]);
  });

  it("should error for each record on runtime error", async () => {
    await expect(runCommand(["xform", "r.a + b", testFile("simple.recs")])).to
      .be.fulfilled;

    expect(result.consoleLines).to.deep.equal([]);
    expect(
      result.logLines.error.map(str =>
        str.includes("ReferenceError - b is not defined")
      )
    ).to.deep.equal([true, true]);
  });
});
