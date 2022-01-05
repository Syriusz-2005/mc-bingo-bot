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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs/promises');
const vec3_1 = require("vec3");
const vec = require('vec3');
const wait = (time) => new Promise(resolve => setTimeout(resolve, time));
const minecraft_data_1 = __importDefault(require("minecraft-data"));
const entityNearby_1 = require("./goal/entityNearby");
const craft_1 = require("./actions/craft");
const getItem = require("prismarine-item");
class CountVector extends vec {
    constructor(x, y, z, count) {
        super(x, y, z);
        this.count = count;
    }
}
class ActionExecuter {
    constructor(cmds) {
        this.cmds = cmds;
        this.setBot(cmds.bot);
        this.mcData = (0, minecraft_data_1.default)(cmds.bot.version);
        this.Item = getItem(cmds.bot.version);
    }
    getItemId(name) {
        return this.mcData.itemsByName[name].id;
    }
    placeBlock(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockInInventory = this.bot.inventory.findInventoryItem(name, null, false);
            if (!blockInInventory)
                return false;
            const blockNearby = this.bot.findBlock({
                maxDistance: 30,
                useExtraInfo: true,
                matching: bl => {
                    return bl.name != 'air'
                        && bl.name != 'water'
                        && bl.name != 'lava'
                        && bl.name != 'dead_bush'
                        && bl.boundingBox == 'block'
                        && this.bot.blockAt(bl.position.offset(0, 1, 0)).name == 'air'
                        && this.bot.entity.position.distanceTo(bl.position) > 2;
                }
            });
            this.bot.pathfinder.setGoal(null);
            yield this.cmds.digManager.goNearbyBlock(blockNearby.position.x, blockNearby.position.y, blockNearby.position.z);
            if (this.bot.inventory.emptySlotCount() == 0) {
                //TODO: remove one item from inventory
            }
            yield this.bot.unequip('hand');
            yield this.bot.equip(blockInInventory, 'hand');
            try {
                yield this.bot.placeBlock(blockNearby, new vec3_1.Vec3(0, 1, 0));
            }
            catch (err) {
                console.log(err);
            }
            return true;
        });
    }
    setBot(bot) {
        this.bot = bot;
    }
    smellItem(itemToSmell, count) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            console.log(`smelting: ${itemToSmell}...`);
            let blockFurnace = this.bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });
            if (!blockFurnace) {
                const result = yield this.cmds.goalInterpreter.GetItem('furnace', 1);
                if (!result) {
                    resolve(false);
                    return;
                }
                const res = yield this.placeBlock('furnace');
                if (!res) {
                    resolve(false);
                    return;
                }
                blockFurnace = this.bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });
            }
            if (!blockFurnace) {
                return yield this.smellItem(itemToSmell, count);
            }
            const fuelData = yield this.cmds.goalInterpreter.GetFuel(count).catch(err => resolve(false));
            yield this.cmds.digManager.goTo(blockFurnace.position.x, blockFurnace.position.y + 1, blockFurnace.position.z);
            const furnace = yield this.bot.openFurnace(blockFurnace);
            yield furnace.takeOutput(null).catch(err => { });
            yield furnace.putFuel(this.getItemId(fuelData.item), 0, fuelData.count).catch(err => { });
            yield furnace.putInput(this.getItemId(itemToSmell), 0, count).catch(err => { });
            function onUpdate() {
                return __awaiter(this, void 0, void 0, function* () {
                    const item = furnace.outputItem();
                    if (!item)
                        return;
                    if (item.count >= count) {
                        try {
                            furnace.off('update', onUpdate);
                            yield furnace.takeOutput(null);
                            furnace.close();
                            resolve(true);
                        }
                        catch (err) {
                            console.warn(err);
                        }
                    }
                });
            }
            furnace.on('update', onUpdate);
        }));
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Promise<boolean>}
     */
    goToItem(x, y, z) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cmds.digManager.goTo(x, y, z);
            return true;
        });
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Promise<boolean>}
     */
    mineBlock(x, y, z) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cmds.digManager.digBlockAt(x, y, z);
            return true;
        });
    }
    /**
   *
   * @param {string} itemName
   * @param {number} count
   * @returns {number}
   */
    isItemInInventory(itemName) {
        try {
            const countInInventory = this.bot.inventory.count(this.getItemId(itemName), null);
            return countInInventory ? countInInventory : 0;
        }
        catch (err) {
            console.warn(`Item ${itemName} is not registered in minecraft data, cannot find item`);
            console.warn(err);
            return 0;
        }
    }
    isItemOnGround(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            let overallCount = 0;
            const nearestEntity = this.bot.nearestEntity(entity => {
                if (entity.mobType != "Item")
                    return false;
                const item = this.Item.fromNotch(entity.metadata[7]);
                if (item.name == itemName) {
                    overallCount = item.count;
                    return true;
                }
                return false;
            });
            if (!nearestEntity)
                return false;
            return new CountVector(nearestEntity.position.x, nearestEntity.position.y, nearestEntity.position.z, overallCount);
        });
    }
    isBlockNearby(blockName) {
        return __awaiter(this, void 0, void 0, function* () {
            const wantedBlock = this.bot.findBlock({
                matching: (block) => block.name == blockName,
                maxDistance: 150
            });
            if (!wantedBlock)
                return false;
            return wantedBlock.position;
        });
    }
}
class GoalInterpreter {
    constructor(cmds, pathToGoals = './build/bingo/goals.json') {
        this.cmds = cmds;
        this.actionExecuter = new ActionExecuter(cmds);
        this.pathToGoals = pathToGoals;
        this.prepare();
    }
    logBlocks() {
        let list = '';
        for (const itemName in this.goals.items)
            list += `, ${itemName}`;
        console.log(list);
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            this.goals = yield this.download(this.pathToGoals);
            this.firstItems = this.goals.config.itemsBotNeeds;
            console.log('Registered the following list of blocks: ');
            this.logBlocks();
        });
    }
    download(pathToGoals) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield fs.readFile(pathToGoals, 'utf-8'));
        });
    }
    resolveActionAfterCondition(condition, resolvingItem, count) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (condition.actionAfterResolved) {
                case 'craft':
                    const action = new craft_1.CraftAction(this.actionExecuter.mcData, this.cmds.bot, this.cmds);
                    yield action.doAction(resolvingItem, condition, count);
                    //if the item was already crafted, nothink will happen...
                    return yield this.GetItem(resolvingItem, count);
                case 'smell':
                    if (typeof condition.name == 'string')
                        return yield this.actionExecuter.smellItem(condition.name, count);
                case 'recheckConditions':
                    return yield this.GetItem(resolvingItem, count);
                default:
                    return true;
            }
        });
    }
    resolveItem(itemName, requiredCount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.GetItem(itemName, requiredCount);
        });
    }
    resolveItemArray(itemArray) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const requiredBlock of itemArray) {
                let count = this.actionExecuter.isItemInInventory(requiredBlock.requiredItem);
                if (count < requiredBlock.requiredCount) {
                    const gotBlock = yield this.resolveItem(requiredBlock.requiredItem, requiredBlock.requiredCount);
                    //if any item cannot be optained, the whole condition will fail
                    if (gotBlock == false) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    resolveInventory(condition, count) {
        return __awaiter(this, void 0, void 0, function* () {
            //name is an array means we need multiple items to resolve condition  
            if (condition.name instanceof Array) {
                return yield this.resolveItemArray(condition.name);
            }
            let currentItemCount = this.actionExecuter.isItemInInventory(condition.name);
            if (condition.recursive == true && currentItemCount < condition.count) {
                return yield this.resolveItem(condition.name, (condition.count ? condition.count : 1) * count - currentItemCount);
            }
            return currentItemCount == 0 ? false : true;
        });
    }
    resolveCondition(condition, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let coordinates;
            let result = false;
            switch (condition.type) {
                case 'inInventory':
                    return yield this.resolveInventory(condition, count);
                case 'itemOnGround':
                    coordinates = yield this.actionExecuter.isItemOnGround(condition.name);
                    if (coordinates) {
                        yield this.actionExecuter.goToItem(coordinates.x, coordinates.y, coordinates.z);
                        result = true;
                    }
                    break;
                case 'blockNearby':
                    coordinates = yield this.actionExecuter.isBlockNearby(condition.name);
                    if (coordinates) {
                        yield this.actionExecuter.mineBlock(coordinates.x, coordinates.y, coordinates.z);
                        result = true;
                    }
                    break;
                case 'entityNearby':
                    const conditionEntityNearby = new entityNearby_1.EntityNearby(this.cmds.bot, condition, this.actionExecuter.mcData, this.cmds);
                    return yield conditionEntityNearby.resolve();
                default:
                    throw new Error('Invalid condition type');
            }
            return result;
        });
    }
    /**
     *
     * @param {string} itemToFind
     * @returns {Promise<boolean>}
     */
    GetItem(itemToFind, count = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.goals.items[itemToFind];
            if (!item) {
                console.log(`Item ${itemToFind} not specified in goals list`);
                return false;
            }
            for (const condition of item.conditions) {
                const result = yield this.resolveCondition(condition, count);
                let sumInInventory = this.actionExecuter.isItemInInventory(itemToFind);
                if (sumInInventory >= count) {
                    return true;
                }
                if (result) {
                    yield wait(500);
                    yield this.resolveActionAfterCondition(condition, itemToFind, count);
                }
                sumInInventory = this.actionExecuter.isItemInInventory(itemToFind);
                if (sumInInventory >= count) {
                    return true;
                }
            }
            return false;
        });
    }
    GetFuel(amountOfItemsToSmell) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: make an interface for this ^
            for (const key in this.goals.items) {
                if (!this.goals.items[key].isFuel)
                    continue;
                const fuelNeeded = Math.ceil(amountOfItemsToSmell / this.goals.items[key].smellingItemsAmount);
                const isItemFound = yield this.GetItem(key, fuelNeeded);
                if (isItemFound) {
                    this.cmds.bot.chat('Getting fuel resulted in true');
                    return {
                        item: key,
                        count: fuelNeeded
                    };
                }
            }
            throw new Error('Getting fuel resulted in false');
        });
    }
}
exports.GoalInterpreter = GoalInterpreter;
