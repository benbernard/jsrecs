module.exports = {
  recursive: true,
  require: ["./build/lib/appSetup.js", "./build/test/testSetup.js"],
  spec: "build/test",
};
