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
exports.CommandInterpreter = void 0;
var dig_js_1 = require("./dig.js");
var gameManager_1 = require("./bingo/gameManager");
var filterNames = require("./bingo/blockNames.js").filterNames;
var GoalInterpreter = require('./bingo/goalInterpreter.js').GoalInterpreter;
var commands = {
    '!hello': {
        run: function (user, bot, params) {
            bot.chat("Hello " + user + ", nice to meet you!");
        }
    },
    '!analyze': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bot.chat('give me a couple of seconds...');
                        return [4 /*yield*/, cmds.gameManager.analyzeTable()];
                    case 1:
                        _a.sent();
                        bot.chat("analyzing done! \n\n        Registered: " + cmds.gameManager.blockList.size + " items to find\n      ");
                        console.log(cmds.gameManager.blockList);
                        return [2 /*return*/];
                }
            });
        }); }
    },
    '!winBingo': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bot.chat('give me a couple of minutes...');
                        return [4 /*yield*/, cmds.gameManager.playBingo()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    },
    '!forceStop': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bot.chat('Stopping bot...');
                        return [4 /*yield*/, cmds.gameManager.forceStop()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    },
    '!restart': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            var cmd, exec;
            return __generator(this, function (_a) {
                bot.webInventory.stop();
                cmd = "node " + './build/index.js';
                exec = require('child_process').exec;
                exec(cmd, function () {
                    process.kill(0);
                });
                return [2 /*return*/];
            });
        }); }
    },
    '!getItem': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            var wantedBlock, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wantedBlock = params[1];
                        bot.chat("Looking for item: " + wantedBlock);
                        return [4 /*yield*/, cmds.gameManager.Get(wantedBlock, params[2])];
                    case 1:
                        result = _a.sent();
                        bot.chat("getting block resulted in " + result);
                        return [2 /*return*/];
                }
            });
        }); }
    },
    'The': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            var itemName;
            return __generator(this, function (_a) {
                if (params[1] != 'item' && params[1] != 'block')
                    return [2 /*return*/];
                itemName = filterNames(params
                    .slice(6, params.length)
                    .reduce(function (acc, name) { return acc + '_' + name; })
                    .toLowerCase());
                cmds.gameManager.addBlock(itemName);
                return [2 /*return*/];
            });
        }); }
    },
    'Green': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (params[1] != 'has' || params[2] != 'gotten')
                    return [2 /*return*/, false];
                cmds.gameManager.registerWin(params[0]);
                return [2 /*return*/];
            });
        }); }
    },
    'Red': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (params[1] != 'has' || params[2] != 'gotten')
                    return [2 /*return*/, false];
                cmds.gameManager.registerWin(params[0]);
                return [2 /*return*/];
            });
        }); }
    },
    'Yellow': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (params[1] != 'has' || params[2] != 'gotten')
                    return [2 /*return*/, false];
                cmds.gameManager.registerWin(params[0]);
                return [2 /*return*/];
            });
        }); }
    },
    'Blue': {
        run: function (user, bot, params, cmds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (params[1] != 'has' || params[2] != 'gotten')
                    return [2 /*return*/, false];
                cmds.gameManager.registerWin(params[0]);
                return [2 /*return*/];
            });
        }); }
    },
};
var CommandInterpreter = /** @class */ (function () {
    function CommandInterpreter(bot) {
        var _this = this;
        this._commands = commands;
        this.bot = bot;
        this.digManager = new dig_js_1.DigManager(bot);
        this.gameManager = new gameManager_1.GameManager(this);
        this.goalInterpreter = new GoalInterpreter(this);
        bot.on('chat', function (user, message) { return _this.onMessage(user, message); });
        bot.on('message', function (jsonMsg) {
            _this.onMessage('server', jsonMsg.toString());
        });
    }
    CommandInterpreter.prototype.onMessage = function (user, message) {
        var command = message.split(' ');
        if (this._commands[command[0]])
            try {
                this._commands[command[0]].run(user, this.bot, command, this);
            }
            catch (err) {
                console.warn(err);
            }
    };
    Object.defineProperty(CommandInterpreter.prototype, "commands", {
        get: function () {
            return this._commands;
        },
        enumerable: false,
        configurable: true
    });
    return CommandInterpreter;
}());
exports.CommandInterpreter = CommandInterpreter;
