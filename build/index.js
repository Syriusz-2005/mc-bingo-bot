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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("types/bot", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("dig", [], function (exports_2, context_2) {
    "use strict";
    var vec, Movement, DigManager;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            vec = require("vec3");
            Movement = require("./movement/movement.js").Movement;
            DigManager = /** @class */ (function () {
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
            exports_2("DigManager", DigManager);
        }
    };
});
System.register("bingo/actions", [], function (exports_3, context_3) {
    "use strict";
    var DefaultActions;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            DefaultActions = /** @class */ (function () {
                function DefaultActions(bot, gameManager) {
                    this.bot = bot;
                    this.gameManager = gameManager;
                }
                DefaultActions.prototype.getTools = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var tools, tools_1, tools_1_1, tool, e_1_1;
                        var e_1, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    tools = this.gameManager.cmdInterpreter.goalInterpreter.firstItems;
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, 7, 8]);
                                    tools_1 = __values(tools), tools_1_1 = tools_1.next();
                                    _b.label = 2;
                                case 2:
                                    if (!!tools_1_1.done) return [3 /*break*/, 5];
                                    tool = tools_1_1.value;
                                    return [4 /*yield*/, this.gameManager.Get(tool.name, tool.count)];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4:
                                    tools_1_1 = tools_1.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_1_1 = _b.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (tools_1_1 && !tools_1_1.done && (_a = tools_1.return)) _a.call(tools_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                };
                DefaultActions.prototype.doActionsBeforeCollecting = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getTools()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return DefaultActions;
            }());
            exports_3("DefaultActions", DefaultActions);
        }
    };
});
System.register("lib/math", [], function (exports_4, context_4) {
    "use strict";
    var math;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            math = /** @class */ (function () {
                function math() {
                }
                math.randomInt = function (min, max) {
                    return Math.floor(Math.random() * (max - min) + min);
                };
                return math;
            }());
            exports_4("math", math);
        }
    };
});
System.register("lib/async", [], function (exports_5, context_5) {
    "use strict";
    var async;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            async = /** @class */ (function () {
                function async() {
                }
                async.wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
                return async;
            }());
            exports_5("async", async);
        }
    };
});
System.register("bingo/gameManager", ["bingo/actions", "lib/math", "lib/async"], function (exports_6, context_6) {
    "use strict";
    var actions_js_1, math_1, async_1, _Block, BotState, GameManager;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (actions_js_1_1) {
                actions_js_1 = actions_js_1_1;
            },
            function (math_1_1) {
                math_1 = math_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            }
        ],
        execute: function () {
            _Block = /** @class */ (function () {
                function _Block(blockId, commandInterpreter) {
                    this.found = false;
                    this.tries = 0;
                    this.blockId = blockId;
                    this._cmdInterpreter = commandInterpreter;
                }
                return _Block;
            }());
            BotState = /** @class */ (function () {
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
            GameManager = /** @class */ (function () {
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
                        var _a, _b, _c, key, value, result, e_2_1, newPosition;
                        var e_2, _d;
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
                                    e_2_1 = _e.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 10];
                                case 9:
                                    try {
                                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                    }
                                    finally { if (e_2) throw e_2.error; }
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
            exports_6("GameManager", GameManager);
        }
    };
});
System.register("commands", ["dig", "bingo/gameManager"], function (exports_7, context_7) {
    "use strict";
    var dig_js_1, gameManager_1, filterNames, GoalInterpreter, commands, CommandInterpreter;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (dig_js_1_1) {
                dig_js_1 = dig_js_1_1;
            },
            function (gameManager_1_1) {
                gameManager_1 = gameManager_1_1;
            }
        ],
        execute: function () {
            filterNames = require("./bingo/blockNames.js").filterNames;
            GoalInterpreter = require('./bingo/goalInterpreter.js').GoalInterpreter;
            commands = {
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
                            cmd = "node " + 'index.js';
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
            CommandInterpreter = /** @class */ (function () {
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
            exports_7("CommandInterpreter", CommandInterpreter);
        }
    };
});
System.register("index", ["mineflayer-pathfinder", "lib/async", "mineflayer-auto-eat"], function (exports_8, context_8) {
    "use strict";
    var _a, _b, _c, mineflayer, mineflayer_pathfinder_1, CommandInterpreter, async_2, mineflayer_auto_eat_1, toolPlugin, pvp, inventoryViewer, botName, host, version, bot, interpreter;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (mineflayer_pathfinder_1_1) {
                mineflayer_pathfinder_1 = mineflayer_pathfinder_1_1;
            },
            function (async_2_1) {
                async_2 = async_2_1;
            },
            function (mineflayer_auto_eat_1_1) {
                mineflayer_auto_eat_1 = mineflayer_auto_eat_1_1;
            }
        ],
        execute: function () {
            mineflayer = require('mineflayer');
            CommandInterpreter = require("./commands.ts").CommandInterperter;
            toolPlugin = require('mineflayer-tool').plugin;
            pvp = require('mineflayer-pvp').plugin;
            inventoryViewer = require("mineflayer-web-inventory");
            botName = ((_a = process.argv.find(function (argument) { return argument.startsWith('name='); })) === null || _a === void 0 ? void 0 : _a.split('=')[1]) || 'bot';
            host = ((_b = process.argv.find(function (argument) { return argument.startsWith('host='); })) === null || _b === void 0 ? void 0 : _b.split('=')[1]) || 'localhost';
            version = ((_c = process.argv.find(function (argument) { return argument.startsWith('version='); })) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || '1.16.4';
            console.log('Bot params: ');
            console.log({ botName: botName, host: host, version: version });
            console.log('To change bot params, type <paramName>=<paramValue>');
            bot = mineflayer.createBot({
                host: host,
                username: botName,
                version: version,
                hideErrors: true
            });
            bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
            bot.loadPlugin(pvp);
            bot.loadPlugin(mineflayer_auto_eat_1.default);
            bot.loadPlugin(toolPlugin);
            try {
                inventoryViewer(bot, {
                    port: 3000
                });
            }
            catch (err) { }
            bot.once("spawn", function () {
                bot.chat('Loading done!');
                bot.autoEat.options.priority = "foodPoints";
                bot.autoEat.options.bannedFood = ["spider_eye"];
                bot.autoEat.options.eatingTimeout = 3;
            });
            bot.on("health", function () {
                if (bot.food === 20)
                    bot.autoEat.disable();
                // Disable the plugin if the bot is at 20 food points
                else
                    bot.autoEat.enable(); // Else enable the plugin again
            });
            bot.setMaxListeners(1000);
            bot.on('kicked', console.log);
            bot.on('error', console.log);
            interpreter = new CommandInterpreter(bot);
            bot.on('death', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bot.pathfinder.stop();
                            return [4 /*yield*/, async_2.async.wait(1500)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
});
System.register("bingo/blockNames", [], function (exports_9, context_9) {
    "use strict";
    var filterNames;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            filterNames = function (name) {
                return name
                    .replace('hay_bale', 'hay_block')
                    .replace('block_of_iron', 'iron_block')
                    .replace('sweet_berries', 'sweet_berries')
                    .replace('minecart_with_chest', 'chest_minecart')
                    .replace('steak', 'cooked_beef')
                    .replace('leather_trousers', 'leather_leggings')
                    .replace('leather_pants', 'leather_leggings')
                    .replace('leather_tunic', 'leather_chestplate');
            };
            exports_9("filterNames", filterNames);
        }
    };
});
System.register("types/conditions", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("bingo/goal/Goal", [], function (exports_11, context_11) {
    "use strict";
    var Goal;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
            Goal = /** @class */ (function () {
                function Goal(bot, condition) {
                    this.bot = bot;
                    this.condition = condition;
                }
                Goal.prototype.getItemId = function (itemName) {
                    return this.mcData.itemsByName[itemName].id;
                };
                Goal.prototype.itemsInInventory = function (itemName) {
                    var countInInventory = this.bot.inventory.count(this.getItemId(itemName), null);
                    return countInInventory ? countInInventory : 0;
                };
                return Goal;
            }());
            exports_11("Goal", Goal);
        }
    };
});
System.register("bingo/goal/resolvable", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("bingo/goal/entityNearby", ["bingo/goal/Goal"], function (exports_13, context_13) {
    "use strict";
    var Goal_js_1, EntityNearby;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (Goal_js_1_1) {
                Goal_js_1 = Goal_js_1_1;
            }
        ],
        execute: function () {
            EntityNearby = /** @class */ (function (_super) {
                __extends(EntityNearby, _super);
                function EntityNearby(bot, condition) {
                    var _this = _super.call(this, bot, condition) || this;
                    if (condition.type != 'entityNearby')
                        throw new Error('condition type must be entityNearby');
                    _this.mobType = condition.name;
                    return _this;
                }
                EntityNearby.prototype.killEntity = function (entity) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.bot.pvp.attack(entity);
                        _this.bot.once('stoppedAttacking', function () {
                            resolve();
                        });
                    });
                };
                EntityNearby.prototype.getEntityNearby = function () {
                    var _this = this;
                    var entity = this.bot.nearestEntity(function (entity) { return entity.type == 'mob' && entity.name == _this.mobType; });
                    if (!entity)
                        throw new Error('Entity not found');
                    return entity;
                };
                EntityNearby.prototype.resolve = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var entityToKill, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    entityToKill = this.getEntityNearby();
                                    return [4 /*yield*/, this.killEntity(entityToKill)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, true];
                                case 2:
                                    err_3 = _a.sent();
                                    console.log(err_3);
                                    return [2 /*return*/, false];
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                return EntityNearby;
            }(Goal_js_1.Goal));
            exports_13("EntityNearby", EntityNearby);
        }
    };
});
System.register("bingo/goalInterpreter", ["vec3", "minecraft-data", "bingo/goal/entityNearby", "prismarine-item"], function (exports_14, context_14) {
    "use strict";
    var fs, vec3_1, wait, minecraft_data_1, entityNearby_1, prismarine_item_1, CountVector, ActionExecuter, GoalInterpreter;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (vec3_1_1) {
                vec3_1 = vec3_1_1;
            },
            function (minecraft_data_1_1) {
                minecraft_data_1 = minecraft_data_1_1;
            },
            function (entityNearby_1_1) {
                entityNearby_1 = entityNearby_1_1;
            },
            function (prismarine_item_1_1) {
                prismarine_item_1 = prismarine_item_1_1;
            }
        ],
        execute: function () {
            fs = require('fs/promises');
            wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
            CountVector = /** @class */ (function (_super) {
                __extends(CountVector, _super);
                function CountVector(x, y, z, count) {
                    var _this = _super.call(this, x, y, z) || this;
                    _this.count = count;
                    return _this;
                }
                return CountVector;
            }(vec3_1.Vec3));
            ActionExecuter = /** @class */ (function () {
                function ActionExecuter(cmds) {
                    this.cmds = cmds;
                    this.setBot(cmds.bot);
                    this.mcData = minecraft_data_1.default(cmds.bot.version);
                    this.Item = prismarine_item_1.Item;
                }
                ActionExecuter.prototype.getItemId = function (name) {
                    return this.mcData.itemsByName[name].id;
                };
                ActionExecuter.prototype.placeBlock = function (name) {
                    return __awaiter(this, void 0, void 0, function () {
                        var blockInInventory, blockNearby, err_4;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    blockInInventory = this.bot.inventory.findInventoryItem(name, null, false);
                                    if (!blockInInventory)
                                        return [2 /*return*/, false];
                                    blockNearby = this.bot.findBlock({
                                        maxDistance: 30,
                                        useExtraInfo: true,
                                        matching: function (bl) {
                                            return bl.name != 'air'
                                                && bl.name != 'water'
                                                && bl.name != 'lava'
                                                && bl.name != 'dead_bush'
                                                && bl.boundingBox == 'block'
                                                && _this.bot.blockAt(bl.position.offset(0, 1, 0)).name == 'air'
                                                && _this.bot.entity.position.distanceTo(bl.position) > 2;
                                        }
                                    });
                                    this.bot.pathfinder.setGoal(null);
                                    return [4 /*yield*/, this.cmds.digManager.goNearbyBlock(blockNearby.position.x, blockNearby.position.y, blockNearby.position.z)];
                                case 1:
                                    _a.sent();
                                    if (this.bot.inventory.emptySlotCount() == 0) {
                                        //TODO: remove one item from inventory
                                    }
                                    return [4 /*yield*/, this.bot.unequip('hand')];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.bot.equip(blockInInventory, 'hand')];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    _a.trys.push([4, 6, , 7]);
                                    return [4 /*yield*/, this.bot.placeBlock(blockNearby, new vec3_1.Vec3(0, 1, 0))];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    err_4 = _a.sent();
                                    console.log(err_4);
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/, true];
                            }
                        });
                    });
                };
                ActionExecuter.prototype.setBot = function (bot) {
                    this.bot = bot;
                };
                ActionExecuter.prototype.craftItem = function (itemName, count, recipyNumber) {
                    if (count === void 0) { count = 1; }
                    if (recipyNumber === void 0) { recipyNumber = 0; }
                    return __awaiter(this, void 0, void 0, function () {
                        var allRecipies, currentRecipe, err_5, blockCrafting, result, res, err_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (recipyNumber >= 50)
                                        return [2 /*return*/, false];
                                    console.log('crafting... ' + itemName);
                                    allRecipies = this.bot.recipesFor(this.getItemId(itemName), null, 0, true);
                                    currentRecipe = allRecipies[recipyNumber];
                                    if (!currentRecipe)
                                        return [2 /*return*/, false];
                                    if (!(currentRecipe.requiresTable == false)) return [3 /*break*/, 6];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 5]);
                                    return [4 /*yield*/, this.bot.craft(currentRecipe, count, null)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 3:
                                    err_5 = _a.sent();
                                    return [4 /*yield*/, this.craftItem(itemName, count, recipyNumber + 1)];
                                case 4: return [2 /*return*/, _a.sent()];
                                case 5: return [2 /*return*/, true];
                                case 6:
                                    blockCrafting = this.bot.findBlock({ matching: function (block) { return block.name == 'crafting_table'; }, maxDistance: 70 });
                                    if (!!blockCrafting) return [3 /*break*/, 9];
                                    return [4 /*yield*/, this.cmds.goalInterpreter.GetItem('crafting_table', 1)];
                                case 7:
                                    result = _a.sent();
                                    if (!result)
                                        return [2 /*return*/, false];
                                    return [4 /*yield*/, this.placeBlock('crafting_table')];
                                case 8:
                                    res = _a.sent();
                                    if (!res)
                                        return [2 /*return*/, false];
                                    blockCrafting = this.bot.findBlock({ matching: function (block) { return block.name == 'crafting_table'; } });
                                    _a.label = 9;
                                case 9:
                                    if (!!blockCrafting) return [3 /*break*/, 11];
                                    return [4 /*yield*/, this.craftItem(itemName, count, recipyNumber)];
                                case 10: return [2 /*return*/, _a.sent()];
                                case 11: return [4 /*yield*/, this.cmds.digManager.goTo(blockCrafting.position.x, blockCrafting.position.y + 1, blockCrafting.position.z)];
                                case 12:
                                    _a.sent();
                                    _a.label = 13;
                                case 13:
                                    _a.trys.push([13, 15, , 17]);
                                    return [4 /*yield*/, this.bot.craft(currentRecipe, count, blockCrafting)];
                                case 14:
                                    _a.sent();
                                    return [3 /*break*/, 17];
                                case 15:
                                    err_6 = _a.sent();
                                    console.log(err_6);
                                    return [4 /*yield*/, this.craftItem(itemName, count, recipyNumber + 1)];
                                case 16: return [2 /*return*/, _a.sent()];
                                case 17: return [2 /*return*/, true];
                            }
                        });
                    });
                };
                ActionExecuter.prototype.smellItem = function (itemToSmell, count) {
                    var _this = this;
                    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        function onUpdate() {
                            return __awaiter(this, void 0, void 0, function () {
                                var item, item_1, err_7;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            item = furnace.outputItem();
                                            if (!item)
                                                return [2 /*return*/];
                                            if (!(item.count >= count)) return [3 /*break*/, 4];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            furnace.off('update', onUpdate);
                                            return [4 /*yield*/, furnace.takeOutput(null)];
                                        case 2:
                                            item_1 = _a.sent();
                                            if (!item_1)
                                                return [2 /*return*/];
                                            furnace.close();
                                            resolve(true);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_7 = _a.sent();
                                            console.warn(err_7);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        var blockFurnace, result, res, fuelData, furnace;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("smelting: " + itemToSmell + "...");
                                    blockFurnace = this.bot.findBlock({ matching: function (block) { return block.name == 'furnace'; }, maxDistance: 70 });
                                    if (!!blockFurnace) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.cmds.goalInterpreter.GetItem('furnace', 1)];
                                case 1:
                                    result = _a.sent();
                                    if (!result) {
                                        resolve(false);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, this.placeBlock('furnace')];
                                case 2:
                                    res = _a.sent();
                                    if (!res) {
                                        resolve(false);
                                        return [2 /*return*/];
                                    }
                                    blockFurnace = this.bot.findBlock({ matching: function (block) { return block.name == 'furnace'; }, maxDistance: 70 });
                                    _a.label = 3;
                                case 3:
                                    if (!!blockFurnace) return [3 /*break*/, 5];
                                    return [4 /*yield*/, this.smellItem(itemToSmell, count)];
                                case 4: return [2 /*return*/, _a.sent()];
                                case 5: return [4 /*yield*/, this.cmds.goalInterpreter.GetFuel(count).catch(function (err) { return resolve(false); })];
                                case 6:
                                    fuelData = _a.sent();
                                    return [4 /*yield*/, this.cmds.digManager.goTo(blockFurnace.position.x, blockFurnace.position.y + 1, blockFurnace.position.z)];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, this.bot.openFurnace(blockFurnace)];
                                case 8:
                                    furnace = _a.sent();
                                    return [4 /*yield*/, furnace.takeOutput(null).catch(function (err) { })];
                                case 9:
                                    _a.sent();
                                    return [4 /*yield*/, furnace.putFuel(this.getItemId(fuelData.item), 0, fuelData.count).catch(function (err) { })];
                                case 10:
                                    _a.sent();
                                    return [4 /*yield*/, furnace.putInput(this.getItemId(itemToSmell), 0, count).catch(function (err) { })];
                                case 11:
                                    _a.sent();
                                    furnace.on('update', onUpdate);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                /**
                 *
                 * @param {number} x
                 * @param {number} y
                 * @param {number} z
                 * @returns {Promise<boolean>}
                 */
                ActionExecuter.prototype.goToItem = function (x, y, z) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.cmds.digManager.goTo(x, y, z)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, true];
                            }
                        });
                    });
                };
                /**
                 *
                 * @param {number} x
                 * @param {number} y
                 * @param {number} z
                 * @returns {Promise<boolean>}
                 */
                ActionExecuter.prototype.mineBlock = function (x, y, z) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.cmds.digManager.digBlockAt(x, y, z)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, true];
                            }
                        });
                    });
                };
                /**
               *
               * @param {string} itemName
               * @param {number} count
               * @returns {number}
               */
                ActionExecuter.prototype.isItemInInventory = function (itemName) {
                    try {
                        var countInInventory = this.bot.inventory.count(this.getItemId(itemName), null);
                        return countInInventory ? countInInventory : 0;
                    }
                    catch (err) {
                        console.warn("Item " + itemName + " is not registered in minecraft data, cannot find item");
                        console.warn(err);
                        return 0;
                    }
                };
                ActionExecuter.prototype.isItemOnGround = function (itemName) {
                    return __awaiter(this, void 0, void 0, function () {
                        var overallCount, nearestEntity;
                        var _this = this;
                        return __generator(this, function (_a) {
                            overallCount = 0;
                            nearestEntity = this.bot.nearestEntity(function (entity) {
                                if (entity.mobType != "Item")
                                    return false;
                                var item = _this.Item.fromNotch(entity.metadata[7]);
                                if (item.name == itemName) {
                                    overallCount = item.count;
                                    return true;
                                }
                                return false;
                            });
                            if (!nearestEntity)
                                return [2 /*return*/, false];
                            return [2 /*return*/, new CountVector(nearestEntity.position.x, nearestEntity.position.y, nearestEntity.position.z, overallCount)];
                        });
                    });
                };
                ActionExecuter.prototype.isBlockNearby = function (blockName) {
                    return __awaiter(this, void 0, void 0, function () {
                        var wantedBlock;
                        return __generator(this, function (_a) {
                            wantedBlock = this.bot.findBlock({
                                matching: function (block) { return block.name == blockName; },
                                maxDistance: 150
                            });
                            if (!wantedBlock)
                                return [2 /*return*/, false];
                            return [2 /*return*/, wantedBlock.position];
                        });
                    });
                };
                return ActionExecuter;
            }());
            GoalInterpreter = /** @class */ (function () {
                function GoalInterpreter(cmds, pathToGoals) {
                    if (pathToGoals === void 0) { pathToGoals = './bingo/goals.json'; }
                    this.cmds = cmds;
                    this.actionExecuter = new ActionExecuter(cmds);
                    this.pathToGoals = pathToGoals;
                    this.prepare();
                }
                GoalInterpreter.prototype.logBlocks = function () {
                    var list = '';
                    for (var itemName in this.goals.items)
                        list += ", " + itemName;
                    console.log(list);
                };
                GoalInterpreter.prototype.prepare = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = this;
                                    return [4 /*yield*/, this.download(this.pathToGoals)];
                                case 1:
                                    _a.goals = _b.sent();
                                    this.firstItems = this.goals.config.itemsBotNeeds;
                                    console.log('Registered the following list of blocks: ');
                                    this.logBlocks();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.download = function (pathToGoals) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, fs.readFile(pathToGoals, 'utf-8')];
                                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.resolveActionAfterCondition = function (condition, resolvingItem, count) {
                    return __awaiter(this, void 0, void 0, function () {
                        var countOfConditionItem, _a, _b, _c, item, countInInventory;
                        var e_3, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    countOfConditionItem = 0;
                                    // also second condition because name is not always the item, name ( could be entity name )
                                    if (!(condition.name instanceof Array) && this.goals.items[condition.name]) {
                                        countOfConditionItem = this.actionExecuter.isItemInInventory(condition.name);
                                    }
                                    _a = condition.actionAfterResolved;
                                    switch (_a) {
                                        case 'craft': return [3 /*break*/, 1];
                                        case 'smell': return [3 /*break*/, 4];
                                        case 'recheckConditions': return [3 /*break*/, 6];
                                    }
                                    return [3 /*break*/, 8];
                                case 1:
                                    if (condition.name instanceof Array) {
                                        try {
                                            for (_b = __values(condition.name), _c = _b.next(); !_c.done; _c = _b.next()) {
                                                item = _c.value;
                                                countInInventory = this.actionExecuter.isItemInInventory(item.requiredItem);
                                                if (countInInventory < item.requiredCount)
                                                    return [2 /*return*/, false];
                                            }
                                        }
                                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                        finally {
                                            try {
                                                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                                            }
                                            finally { if (e_3) throw e_3.error; }
                                        }
                                    }
                                    if (condition.count > countOfConditionItem)
                                        return [2 /*return*/, false];
                                    return [4 /*yield*/, this.actionExecuter.craftItem(resolvingItem, Math.ceil(count / condition.resultsIn))];
                                case 2:
                                    _e.sent();
                                    return [4 /*yield*/, this.GetItem(resolvingItem, count)];
                                case 3: 
                                //if the item was already crafted, nothink will happen...
                                return [2 /*return*/, _e.sent()];
                                case 4: return [4 /*yield*/, this.actionExecuter.smellItem(condition.name, count)];
                                case 5: return [2 /*return*/, _e.sent()];
                                case 6: return [4 /*yield*/, this.GetItem(resolvingItem, count)];
                                case 7: return [2 /*return*/, _e.sent()];
                                case 8: return [2 /*return*/, true];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.resolveItem = function (itemName, requiredCount) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.GetItem(itemName, requiredCount)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.resolveItemArray = function (itemArray) {
                    return __awaiter(this, void 0, void 0, function () {
                        var itemArray_1, itemArray_1_1, requiredBlock, count, gotBlock, e_4_1;
                        var e_4, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, 6, 7]);
                                    itemArray_1 = __values(itemArray), itemArray_1_1 = itemArray_1.next();
                                    _b.label = 1;
                                case 1:
                                    if (!!itemArray_1_1.done) return [3 /*break*/, 4];
                                    requiredBlock = itemArray_1_1.value;
                                    count = this.actionExecuter.isItemInInventory(requiredBlock.requiredItem);
                                    if (!(count < requiredBlock.requiredCount)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.resolveItem(requiredBlock.requiredItem, requiredBlock.requiredCount)];
                                case 2:
                                    gotBlock = _b.sent();
                                    //if any item cannot be optained, the whole condition will fail
                                    if (gotBlock == false) {
                                        return [2 /*return*/, false];
                                    }
                                    _b.label = 3;
                                case 3:
                                    itemArray_1_1 = itemArray_1.next();
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    e_4_1 = _b.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 7];
                                case 6:
                                    try {
                                        if (itemArray_1_1 && !itemArray_1_1.done && (_a = itemArray_1.return)) _a.call(itemArray_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/, true];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.resolveInventory = function (condition, count) {
                    return __awaiter(this, void 0, void 0, function () {
                        var currentItemCount;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(condition.name instanceof Array)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.resolveItemArray(condition.name)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    currentItemCount = this.actionExecuter.isItemInInventory(condition.name);
                                    if (!(condition.recursive == true && currentItemCount < condition.count)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.resolveItem(condition.name, (condition.count ? condition.count : 1) * count - currentItemCount)];
                                case 3: return [2 /*return*/, _a.sent()];
                                case 4: return [2 /*return*/, currentItemCount == 0 ? false : true];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.resolveCondition = function (condition, count) {
                    return __awaiter(this, void 0, void 0, function () {
                        var coordinates, result, _a, conditionEntityNearby;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    result = false;
                                    _a = condition.type;
                                    switch (_a) {
                                        case 'inInventory': return [3 /*break*/, 1];
                                        case 'itemOnGround': return [3 /*break*/, 3];
                                        case 'blockNearby': return [3 /*break*/, 7];
                                        case 'entityNearby': return [3 /*break*/, 11];
                                    }
                                    return [3 /*break*/, 13];
                                case 1: return [4 /*yield*/, this.resolveInventory(condition, count)];
                                case 2: return [2 /*return*/, _b.sent()];
                                case 3: return [4 /*yield*/, this.actionExecuter.isItemOnGround(condition.name)];
                                case 4:
                                    coordinates = _b.sent();
                                    if (!coordinates) return [3 /*break*/, 6];
                                    return [4 /*yield*/, this.actionExecuter.goToItem(coordinates.x, coordinates.y, coordinates.z)];
                                case 5:
                                    _b.sent();
                                    result = true;
                                    _b.label = 6;
                                case 6: return [3 /*break*/, 14];
                                case 7: return [4 /*yield*/, this.actionExecuter.isBlockNearby(condition.name)];
                                case 8:
                                    coordinates = _b.sent();
                                    if (!coordinates) return [3 /*break*/, 10];
                                    return [4 /*yield*/, this.actionExecuter.mineBlock(coordinates.x, coordinates.y, coordinates.z)];
                                case 9:
                                    _b.sent();
                                    result = true;
                                    _b.label = 10;
                                case 10: return [3 /*break*/, 14];
                                case 11:
                                    conditionEntityNearby = new entityNearby_1.EntityNearby(this.cmds.bot, condition);
                                    return [4 /*yield*/, conditionEntityNearby.resolve()];
                                case 12: return [2 /*return*/, _b.sent()];
                                case 13: throw new Error('Invalid condition type');
                                case 14: return [2 /*return*/, result];
                            }
                        });
                    });
                };
                /**
                 *
                 * @param {string} itemToFind
                 * @returns {Promise<boolean>}
                 */
                GoalInterpreter.prototype.GetItem = function (itemToFind, count) {
                    if (count === void 0) { count = 1; }
                    return __awaiter(this, void 0, void 0, function () {
                        var item, _a, _b, condition, result, sumInInventory, e_5_1;
                        var e_5, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    item = this.goals.items[itemToFind];
                                    if (!item) {
                                        console.log("Item " + itemToFind + " not specified in goals list");
                                        return [2 /*return*/, false];
                                    }
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 9, 10, 11]);
                                    _a = __values(item.conditions), _b = _a.next();
                                    _d.label = 2;
                                case 2:
                                    if (!!_b.done) return [3 /*break*/, 8];
                                    condition = _b.value;
                                    return [4 /*yield*/, this.resolveCondition(condition, count)];
                                case 3:
                                    result = _d.sent();
                                    sumInInventory = this.actionExecuter.isItemInInventory(itemToFind);
                                    if (sumInInventory >= count) {
                                        return [2 /*return*/, true];
                                    }
                                    if (!result) return [3 /*break*/, 6];
                                    return [4 /*yield*/, wait(500)];
                                case 4:
                                    _d.sent();
                                    return [4 /*yield*/, this.resolveActionAfterCondition(condition, itemToFind, count)];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    sumInInventory = this.actionExecuter.isItemInInventory(itemToFind);
                                    if (sumInInventory >= count) {
                                        return [2 /*return*/, true];
                                    }
                                    _d.label = 7;
                                case 7:
                                    _b = _a.next();
                                    return [3 /*break*/, 2];
                                case 8: return [3 /*break*/, 11];
                                case 9:
                                    e_5_1 = _d.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 11];
                                case 10:
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                    return [7 /*endfinally*/];
                                case 11: return [2 /*return*/, false];
                            }
                        });
                    });
                };
                GoalInterpreter.prototype.GetFuel = function (amountOfItemsToSmell) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b, _i, key, fuelNeeded, isItemFound;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = [];
                                    for (_b in this.goals.items)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    key = _a[_i];
                                    if (!this.goals.items[key].isFuel)
                                        return [3 /*break*/, 3];
                                    fuelNeeded = Math.ceil(amountOfItemsToSmell / this.goals.items[key].smellingItemsAmount);
                                    return [4 /*yield*/, this.GetItem(key, fuelNeeded)];
                                case 2:
                                    isItemFound = _c.sent();
                                    if (isItemFound) {
                                        this.cmds.bot.chat('Getting fuel resulted in true');
                                        return [2 /*return*/, {
                                                item: key,
                                                count: fuelNeeded
                                            }];
                                    }
                                    _c.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: throw new Error('Getting fuel resulted in false');
                            }
                        });
                    });
                };
                return GoalInterpreter;
            }());
            exports.GoalInterpreter = GoalInterpreter;
        }
    };
});
System.register("bingo/actions/Action", [], function (exports_15, context_15) {
    "use strict";
    var Action;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            Action = /** @class */ (function () {
                function Action(overwriteDefaultBehaviors, _a) {
                    if (overwriteDefaultBehaviors === void 0) { overwriteDefaultBehaviors = false; }
                    var _b = _a.allowedConditions, allowedConditions = _b === void 0 ? [] : _b;
                    this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
                    this.allowedConditions = allowedConditions;
                }
                return Action;
            }());
            exports_15("Action", Action);
        }
    };
});
System.register("movement/movement", ["mineflayer-pathfinder", "minecraft-data"], function (exports_16, context_16) {
    "use strict";
    var mineflayer_pathfinder_2, minecraft_data_2, goals, mineflayer, Movement;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (mineflayer_pathfinder_2_1) {
                mineflayer_pathfinder_2 = mineflayer_pathfinder_2_1;
            },
            function (minecraft_data_2_1) {
                minecraft_data_2 = minecraft_data_2_1;
            }
        ],
        execute: function () {
            goals = mineflayer_pathfinder_2.default.goals;
            mineflayer = require('mineflayer');
            Movement = /** @class */ (function () {
                function Movement(bot) {
                    this.goals = goals;
                    this.bot = bot;
                    this.mcData = minecraft_data_2.default(bot.version);
                    this.defaultMove = new mineflayer_pathfinder_2.default.Movements(bot, this.mcData);
                    this.defaultMove.scafoldingBlocks.push(this.mcData.itemsByName['netherrack'].id);
                    bot.pathfinder.setMovements(this.defaultMove);
                }
                Movement.prototype.getGoals = function () {
                    return this.goals;
                };
                Movement.prototype.goTo = function (goal) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.bot.pathfinder.goto(goal)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                return Movement;
            }());
            exports.Movement = Movement;
        }
    };
});
