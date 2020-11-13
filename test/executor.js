import Executor from "../lib/executor.js";
import Record from "../lib/record.js";
import { expect } from "./testSetup.js";

describe("Executor", () => {
  it("should allow record modification", () => {
    let r = new Record({ a: 1 });
    let exe = new Executor({ code: "r.a = 2" });
    exe.run(r);
    expect(r.a).to.equal(2);
  });

  it("should have line counts", () => {
    let exe = new Executor({ code: "r.line = LINE" });
    let r = new Record({ a: 1 });
    let r2 = new Record({ a: 2 });
    exe.run(r);
    exe.run(r2);

    expect(r.line).to.equal(1);
    expect(r2.line).to.equal(2);
  });

  it("should return an expression", () => {
    let r = new Record({ a: "ben" });
    let exe = new Executor({ code: "r.data.a" });
    expect(exe.run(r)).to.equal("ben");
  });
});
