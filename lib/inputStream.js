import LDJSONStream from "ld-jsonstream";

console.log("done");
console.log({ foo: "bar" });

// const LDJSONStream = require("ld-jsonstream");
//
// process.stdin.pipe(new LDJSONStream({ objectMode: true })).on("data", obj => {
//   console.log("got obj");
// });

export default class InputStream {}
