const path = require("path");

const appRoot = (exports.appRoot = path.resolve(__dirname));

const prequire = (global.prequire = function (src) {
  return require(path.join(appRoot, src));
});

const _ = (global._ = prequire("lodash"));
