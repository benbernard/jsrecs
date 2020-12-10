import "lib/commands/evalCommand";
import { runCommand, setupCommandTest, BailError } from "./helper";
import { testFile } from "test/testSetup";

describe("Eval Command", () => {
  let result = setupCommandTest();

  it("should run eval command", async () => {
    await runCommand(["eval", "r.a + 2", testFile("simple.recs")]);
    expect(result.consoleLines).to.deep.equal(["3", "4"]);
  });

  it("should output objects", async () => {
    await runCommand(["eval", "return {ben: 'foo'}", testFile("simple.recs")]);
    expect(result.consoleLines).to.deep.equal([
      '{"ben":"foo"}',
      '{"ben":"foo"}',
    ]);
  });

  // it("should allow global variables", async () => {
  //   await runCommand([
  //     "xform",
  //     "global.count ??= 0; count++; r.b = count",
  //     testFile("simple.recs"),
  //   ]);
  //
  //   expect(await result.records()).to.be.records([
  //     { a: 1, b: 1 },
  //     { a: 2, b: 2 },
  //   ]);
  // });
  //
  // it("should error once on snippet syntax error", async () => {
  //   await expect(
  //     runCommand(["xform", "r.a + ", testFile("simple.recs")])
  //   ).to.be.rejectedWith(BailError, "Unexpected token");
  //
  //   expect(result.consoleLines).to.deep.equal([]);
  // });
  //
  // it("should error for each record on runtime error", async () => {
  //   await expect(runCommand(["xform", "r.a + b", testFile("simple.recs")])).to
  //     .be.fulfilled;
  //
  //   expect(result.consoleLines).to.deep.equal([]);
  //   expect(
  //     result.logLines.error.map(str =>
  //       str.includes("ReferenceError - b is not defined")
  //     )
  //   ).to.deep.equal([true, true]);
  // });
});
