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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
exports.__esModule = true;
exports.pipeline = exports.OutputStream = exports.GeneratorStream = void 0;
var GeneratorStream = /** @class */ (function () {
    function GeneratorStream(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.generator, generator = _c === void 0 ? null : _c;
        this.generator = null;
        if (generator)
            this.pipeFrom(generator);
    }
    GeneratorStream.prototype.pipeFrom = function (generator) {
        if (this.generator) {
            throw new Error("GeneratorStream already has a geneator!");
        }
        this.generator = generator;
    };
    GeneratorStream.prototype[Symbol.asyncIterator] = function () {
        return __asyncGenerator(this, arguments, function _a() {
            var _b, _c, data, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 8, 9, 14]);
                        _b = __asyncValues(this.generator);
                        _e.label = 1;
                    case 1: return [4 /*yield*/, __await(_b.next())];
                    case 2:
                        if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 7];
                        data = _c.value;
                        return [4 /*yield*/, __await(this.handle(data))];
                    case 3: return [4 /*yield*/, __await.apply(void 0, [_e.sent()])];
                    case 4: return [4 /*yield*/, _e.sent()];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6: return [3 /*break*/, 1];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _e.trys.push([9, , 12, 13]);
                        if (!(_c && !_c.done && (_d = _b["return"]))) return [3 /*break*/, 11];
                        return [4 /*yield*/, __await(_d.call(_b))];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    GeneratorStream.prototype.handle = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Subclass should implement");
            });
        });
    };
    GeneratorStream.prototype.exhaust = function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, unused, e_2_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 11]);
                        _b = __asyncValues(this);
                        _d.label = 1;
                    case 1: return [4 /*yield*/, _b.next()];
                    case 2:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 4];
                        unused = _c.value;
                        _d.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 11];
                    case 6:
                        _d.trys.push([6, , 9, 10]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 8];
                        return [4 /*yield*/, _a.call(_b)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 10: return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return GeneratorStream;
}());
exports.GeneratorStream = GeneratorStream;
var OutputStream = /** @class */ (function (_super) {
    __extends(OutputStream, _super);
    function OutputStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OutputStream.prototype.handle = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(data);
                return [2 /*return*/, data];
            });
        });
    };
    return OutputStream;
}(GeneratorStream));
exports.OutputStream = OutputStream;
function pipeline() {
    var generatorStreams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        generatorStreams[_i] = arguments[_i];
    }
    if (generatorStreams.length <= 1) {
        throw new Error("Pipeline called with only " + generatorStreams.length + " streams");
    }
    var last = generatorStreams.pop();
    var previous = last;
    for (var _a = 0, _b = generatorStreams.reverse(); _a < _b.length; _a++) {
        var generator = _b[_a];
        previous.pipeFrom(generator);
        previous = generator;
    }
    return last;
}
exports.pipeline = pipeline;
