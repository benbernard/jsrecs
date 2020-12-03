"use strict";
exports.__esModule = true;
exports.Record = void 0;
var Record = /** @class */ (function () {
    function Record(data) {
        this.data = data;
    }
    Record.prototype.toJSON = function () {
        return this.data;
    };
    return Record;
}());
exports.Record = Record;
exports["default"] = Record;
