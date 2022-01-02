"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
class Goal {
    constructor(bot, condition) {
        this.bot = bot;
        this.condition = condition;
    }
    getItemId(itemName) {
        return this.mcData.itemsByName[itemName].id;
    }
    itemsInInventory(itemName) {
        const countInInventory = this.bot.inventory.count(this.getItemId(itemName), null);
        return countInInventory ? countInInventory : 0;
    }
}
exports.Goal = Goal;
