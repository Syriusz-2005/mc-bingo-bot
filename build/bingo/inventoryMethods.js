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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMethods = void 0;
const vec3_1 = require("vec3");
const noBlockError_1 = require("./errors/noBlockError");
const noItemError_1 = require("./errors/noItemError");
const unableToPlaceError_1 = require("./errors/unableToPlaceError");
class InventoryMethods {
    constructor(mcData, bot, cmds) {
        this.mcData = mcData;
        this.bot = bot;
        this.cmds = cmds;
    }
    getItemId(itemName) {
        var _a;
        return (_a = this.mcData.itemsByName[itemName]) === null || _a === void 0 ? void 0 : _a.id;
    }
    isPlacableBlock(block) {
        return block.name != 'air'
            && block.name != 'water'
            && block.name != 'lava'
            && block.name != 'dead_bush'
            && block.boundingBox == 'block'
            && this.bot.blockAt(block.position.offset(0, 1, 0)).name == 'air'
            && this.bot.entity.position.distanceTo(block.position) > 2;
    }
    placeBlock(blockName) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemInInventory = this.bot.inventory.findInventoryItem(this.getItemId(blockName), null, false);
            if (!itemInInventory)
                throw new noItemError_1.NoItemError(blockName, 'There is no item in inventory');
            const blockNearby = this.bot.findBlock({
                maxDistance: Number(process.env.BLOCK_PLACING_SEARCH_DISTANCE),
                useExtraInfo: true,
                matching: this.isPlacableBlock
            });
            if (!blockNearby)
                throw new noBlockError_1.NoBlockError('block');
            this.bot.pathfinder.setGoal(null);
            const wentNearby = yield this.cmds.digManager.goNearbyBlock(blockNearby.position.x, blockNearby.position.y, blockNearby.position.z);
            if (this.bot.inventory.emptySlotCount() == 0) {
                //TODO: bot should throw away some items!
            }
            let i = 0;
            while (true) {
                i++;
                yield this.bot.unequip('hand');
                yield this.bot.equip(itemInInventory, 'hand');
                try {
                    yield this.bot.placeBlock(blockNearby, new vec3_1.Vec3(0, 1, 0));
                    return;
                }
                catch (err) {
                    console.warn(err);
                }
                if (i >= 100)
                    throw new unableToPlaceError_1.UnableToPlaceError(itemInInventory.name);
            }
        });
    }
    goOntoBlock(blockName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.placeBlock(blockName);
            const blockPlaced = this.bot.findBlock({
                maxDistance: Number(process.env.BLOCK_PLACING_SEARCH_DISTANCE),
                useExtraInfo: false,
                matching: block => block.name == blockName
            });
            yield this.cmds.digManager.goTo(blockPlaced.position.x, blockPlaced.position.y, blockPlaced.position.z);
            return blockPlaced;
        });
    }
}
exports.InventoryMethods = InventoryMethods;
