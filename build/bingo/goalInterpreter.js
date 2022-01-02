"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs/promises');
var vec3_1 = require("vec3");
var wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
var minecraft_data_1 = __importDefault(require("minecraft-data"));
var entityNearby_1 = require("./goal/entityNearby");
var prismarine_item_1 = require("prismarine-item");
var CountVector = /** @class */ (function (_super) {
    __extends(CountVector, _super);
    function CountVector(x, y, z, count) {
        var _this = _super.call(this, x, y, z) || this;
        _this.count = count;
        return _this;
    }
    return CountVector;
}(vec3_1.Vec3));
var ActionExecuter = /** @class */ (function () {
    function ActionExecuter(cmds) {
        this.cmds = cmds;
        this.setBot(cmds.bot);
        this.mcData = (0, minecraft_data_1.default)(cmds.bot.version);
        this.Item = prismarine_item_1.Item;
    }
    ActionExecuter.prototype.getItemId = function (name) {
        return this.mcData.itemsByName[name].id;
    };
    ActionExecuter.prototype.placeBlock = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var blockInInventory, blockNearby, err_1;
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
                        err_1 = _a.sent();
                        console.log(err_1);
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
            var allRecipies, currentRecipe, err_2, blockCrafting, result, res, err_3;
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
                        err_2 = _a.sent();
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
                        err_3 = _a.sent();
                        console.log(err_3);
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
                    var item, item_1, err_4;
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
                                err_4 = _a.sent();
                                console.warn(err_4);
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
var GoalInterpreter = /** @class */ (function () {
    function GoalInterpreter(cmds, pathToGoals) {
        if (pathToGoals === void 0) { pathToGoals = './build/bingo/goals.json'; }
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
            var e_1, _d;
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
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                                }
                                finally { if (e_1) throw e_1.error; }
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
            var itemArray_1, itemArray_1_1, requiredBlock, count, gotBlock, e_2_1;
            var e_2, _a;
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
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (itemArray_1_1 && !itemArray_1_1.done && (_a = itemArray_1.return)) _a.call(itemArray_1);
                        }
                        finally { if (e_2) throw e_2.error; }
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
            var item, _a, _b, condition, result, sumInInventory, e_3_1;
            var e_3, _c;
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
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
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
