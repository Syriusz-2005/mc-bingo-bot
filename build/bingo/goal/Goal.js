"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
const inventoryMethods_1 = require("../inventoryMethods");
class Goal {
    constructor(bot, condition, mcData, commandInterpreter) {
        this.bot = bot;
        this.condition = condition;
        this.mcData = mcData;
        this.inventoryMethods = new inventoryMethods_1.InventoryMethods(mcData, bot, commandInterpreter);
    }
    itemsInInventory(itemName) {
        const countInInventory = this.bot.inventory.count(this.inventoryMethods.getItemId(itemName), null);
        return countInInventory ? countInInventory : 0;
    }
}
exports.Goal = Goal;
