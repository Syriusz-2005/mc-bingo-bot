"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const inventoryMethods_1 = require("../inventoryMethods");
class Action {
    constructor(overwriteDefaultBehaviors = false, { allowedConditions = [], mcData, bot, cmds }) {
        this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
        this.allowedConditions = allowedConditions;
        this.inventoryMethods = new inventoryMethods_1.InventoryMethods(mcData, bot, cmds);
        this.bot = bot;
    }
    getNeededItemCount(itemName) {
        return this.bot.inventory.count(this.inventoryMethods.getItemId(itemName), null);
    }
}
exports.Action = Action;
