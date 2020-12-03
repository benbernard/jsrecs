"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.s = exports.recordGenerator = exports.objStreamFromArgs = exports.multiStreamForArgs = exports.RecordGeneratorStream = void 0;
var fs = require("fs");
var multistream_1 = require("multistream");
var stream_1 = require("stream");
var ndjson_1 = require("ndjson");
var record_1 = require("lib/record");
var generatorStream_1 = require("lib/generatorStream");
function multiStreamForArgs(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.files, files = _c === void 0 ? [] : _c, _d = _b.streams, streams = _d === void 0 ? [process.stdin] : _d, _e = _b.separator, separator = _e === void 0 ? "" : _e;
    var originStreams = __spreadArrays(streams);
    if (files.length > 0) {
        originStreams = files.map(function (path) { return function () { return s(fs.createReadStream(path)); }; });
    }
    var separatedStreams = [];
    for (var _i = 0, originStreams_1 = originStreams; _i < originStreams_1.length; _i++) {
        var stream = originStreams_1[_i];
        separatedStreams.push(stream);
        if (separator)
            separatedStreams.push(stream_1.Readable.from(separator));
    }
    return s(new multistream_1["default"](separatedStreams));
}
exports.multiStreamForArgs = multiStreamForArgs;
function objStreamFromArgs(argOpts) {
    if (argOpts === void 0) { argOpts = {}; }
    var multiStream = multiStreamForArgs(argOpts);
    var stream = s(ndjson_1["default"].parse());
    multiStream.pipe(stream);
    return stream;
}
exports.objStreamFromArgs = objStreamFromArgs;
var RecordGeneratorStream = /** @class */ (function (_super) {
    __extends(RecordGeneratorStream, _super);
    function RecordGeneratorStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RecordGeneratorStream.prototype.handle = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new record_1.Record(obj)];
            });
        });
    };
    return RecordGeneratorStream;
}(generatorStream_1.GeneratorStream));
exports.RecordGeneratorStream = RecordGeneratorStream;
function recordGenerator(argOpts) {
    if (argOpts === void 0) { argOpts = {}; }
    var objStream = objStreamFromArgs(__assign({ separator: "\n" }, argOpts));
    return new RecordGeneratorStream({ generator: objStream });
}
exports.recordGenerator = recordGenerator;
function s(stream) {
    stream.on("error", function (err) {
        throw err;
    });
    return stream;
}
exports.s = s;
