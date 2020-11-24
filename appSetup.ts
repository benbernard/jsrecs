const path = require("path");

const appRoot = (exports.appRoot = path.resolve(__dirname));

const projpath = (exports.projpath = function (src) {
  return path.join(appRoot, src);
});

const prequire = (global.prequire = function (src) {
  return require(projpath(src));
});

const _ = (global._ = prequire("lodash"));
