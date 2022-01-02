"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
var Goal = /** @class */ (function () {
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
exports.Goal = Goal;
