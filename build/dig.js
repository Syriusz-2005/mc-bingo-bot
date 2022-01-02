"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigManager = void 0;
var vec = require("vec3");
var Movement = require("./movement/movement.js").Movement;
var DigManager = /** @class */ (function () {
    function DigManager(bot) {
        this.bot = bot;
        this.movement = new Movement(bot);
    }
    DigManager.prototype.removeGoals = function () {
        this.movement.goTo(null).catch(function (err) { });
    };
    DigManager.prototype.goTo = function (x, y, z) {
        var _this = this;
        return new Promise(function (resolve) {
            var goal = new (_this.movement.getGoals().GoalBlock)(x, y, z, _this.bot);
            _this.movement.goTo(goal)
                .then(resolve)
                .catch(resolve);
        });
    };
    DigManager.prototype.goNearby = function (x, z) {
        var _this = this;
        return new Promise(function (resolve) {
            var goal = new (_this.movement.getGoals().GoalNearXZ)(x, z, 4);
            _this.movement.goTo(goal)
                .then(resolve)
                .catch(resolve);
        });
    };
    DigManager.prototype.goNearbyBlock = function (x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var block, goal, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        block = this.bot.blockAt(new vec(x, y, z));
                        if (this.bot.canDigBlock(block)) {
                            return [2 /*return*/, true];
                        }
                        goal = new (this.movement.getGoals().GoalPlaceBlock)(new vec(x, y, z), this.bot.world, {
                            range: 3,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.movement.goTo(goal)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DigManager.prototype.digBlockAt = function (x, y, z) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var that = _this;
            function onPathUpdate(r) {
                if (r.status == 'noPath') {
                    that.bot.off('path_update', onPathUpdate);
                    resolve();
                }
            }
            try {
                var blockToDig = _this.bot.blockAt(new vec(x, y, z));
                if (_this.bot.canDigBlock(blockToDig)) {
                    _this.tryDigBlockAt(x, y, z)
                        .then(resolve)
                        .catch(resolve);
                    return;
                }
                _this.bot.on('path_update', onPathUpdate);
                var goal = new (_this.movement.getGoals().GoalBreakBlock)(x, y, z, _this.bot);
                _this.movement.goTo(goal)
                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.bot.off('path_update', onPathUpdate);
                                return [4 /*yield*/, this.tryDigBlockAt(x, y, z)];
                            case 1:
                                _a.sent();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(err);
                                this.bot.off('path_update', onPathUpdate);
                                return [4 /*yield*/, this.tryDigBlockAt(x, y, z)];
                            case 1:
                                _a.sent();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (err) {
                _this.bot.off('path_update', onPathUpdate);
                resolve();
            }
        });
    };
    DigManager.prototype.tryDigBlockAt = function (x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var blockToDig, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.bot.chat("Digging block: " + x + ", " + y + ", " + z);
                        blockToDig = this.bot.blockAt(new vec(x, y, z));
                        this.bot.tool.equipForBlock(blockToDig, {});
                        return [4 /*yield*/, this.bot.dig(blockToDig)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DigManager;
}());
exports.DigManager = DigManager;
