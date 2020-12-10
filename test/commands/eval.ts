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

  it("should output numbers", async () => {
    await runCommand(["eval", "return LINE", testFile("simple.recs")]);
    expect(result.consoleLines).to.deep.equal(["1", "2"]);
  });
});
