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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var actions_js_1 = require("./actions.js");
var math_1 = require("../lib/math");
var async_1 = require("../lib/async");
var _Block = /** @class */ (function () {
    function _Block(blockId, commandInterpreter) {
        this.found = false;
        this.tries = 0;
        this.blockId = blockId;
        this._cmdInterpreter = commandInterpreter;
    }
    return _Block;
}());
var BotState = /** @class */ (function () {
    function BotState(possibleStates) {
        this.state = '';
        this.possibleStates = [];
        this.possibleStates = possibleStates;
    }
    BotState.prototype.toggle = function (newState) {
        var isState = this.possibleStates.find(function (state) { return state == newState; });
        if (!isState)
            throw new Error("Enexpected state name " + newState);
        this.state = newState;
    };
    return BotState;
}());
var GameManager = /** @class */ (function () {
    function GameManager(commandInterperter) {
        this.blockList = new Map();
        this.state = new BotState(['idle', 'looking']);
        this.cmdInterpreter = commandInterperter;
        this.bot = commandInterperter.bot;
        this.botActions = new actions_js_1.DefaultActions(this.bot, this);
        this.forcedStop = false;
    }
    GameManager.prototype.analyzeTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i <= 25)) return [3 /*break*/, 4];
                        return [4 /*yield*/, async_1.async.wait(900)];
                    case 2:
                        _a.sent();
                        this.bot.chat("/trigger clarify set " + i);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GameManager.prototype.addBlock = function (blockId) {
        this.blockList.set(blockId, new _Block(blockId, this.cmdInterpreter));
    };
    GameManager.prototype.forceStop = function () {
        this.cmdInterpreter.digManager.removeGoals();
        this.state.toggle('idle');
        this.forcedStop = true;
    };
    GameManager.prototype.getRandomPosition = function () {
        var blockToGo = this.bot.findBlock({
            maxDistance: 100,
            point: this.bot.entity.position.offset(math_1.math.randomInt(-10, 100), 0, math_1.math.randomInt(-10, 100)),
            useExtraInfo: true,
            matching: function (block) {
                return block.biome.category != 'ocean';
            }
        });
        return blockToGo.position;
    };
    GameManager.prototype.playBingo = function (deep) {
        if (deep === void 0) { deep = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, key, value, result, e_1_1, newPosition;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.botActions.doActionsBeforeCollecting()];
                    case 1:
                        _e.sent();
                        if (deep >= 40)
                            return [2 /*return*/];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 8, 9, 10]);
                        _a = __values(this.blockList), _b = _a.next();
                        _e.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 7];
                        _c = __read(_b.value, 2), key = _c[0], value = _c[1];
                        if (this.forcedStop == true) {
                            this.forcedStop = false;
                            return [2 /*return*/];
                        }
                        if (value.found)
                            return [3 /*break*/, 6];
                        console.log('finding item ', value.blockId);
                        value.tries++;
                        return [4 /*yield*/, this.Get(value.blockId, 1)];
                    case 4:
                        result = _e.sent();
                        if (result == true) {
                            value.found = true;
                            this.bot.chat("item " + key + " found!");
                        }
                        return [4 /*yield*/, async_1.async.wait(1000)];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        newPosition = this.getRandomPosition();
                        return [4 /*yield*/, this.cmdInterpreter.digManager.goNearby(newPosition.x, newPosition.z)];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, this.playBingo(deep + 1)];
                    case 12: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    GameManager.prototype.Get = function (itemName, count) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.state.toggle('looking');
                        return [4 /*yield*/, this.cmdInterpreter.goalInterpreter.GetItem(itemName, count)];
                    case 1:
                        result = _a.sent();
                        this.state.toggle('idle');
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     *
     * @param {string} winTeam
     * @returns
     */
    GameManager.prototype.registerWin = function (winTeam) {
        this.forceStop();
        winTeam = winTeam
            .replace(/G/g, 'g')
            .replace(/R/g, 'r')
            .replace(/B/g, 'b')
            .replace(/Y/g, 'Y');
        console.log('registered win of ' + winTeam);
        var botTeam = this.bot.teamMap[this.bot.username];
        if (!botTeam)
            return;
        if (botTeam.team == winTeam) {
            this.bot.chat('I won, that was easy');
        }
    };
    return GameManager;
}());
exports.GameManager = GameManager;
