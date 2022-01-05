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
exports.CraftAction = void 0;
const Action_1 = require("./Action");
class CraftAction extends Action_1.Action {
    constructor(mcData, bot, cmds) {
        super(false, {
            allowedConditions: ["in_inventory"],
            mcData,
            bot,
            cmds
        });
    }
    craftInInventory(recipe, timesCrafted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bot.craft(recipe, timesCrafted, null);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    craftItem(itemName, timesCrafted = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipies = this.bot.recipesFor(this.inventoryMethods.getItemId(itemName), null, 0, true);
            for (let i = 0; i < recipies.length; i++) {
                const recipe = recipies[i];
                if (!recipe)
                    continue;
                if (!recipe.requiresTable) {
                    this.craftInInventory(recipe, timesCrafted);
                    continue;
                }
                //recipe requires crafting table!
                const crafting = yield this.inventoryMethods.goOntoBlock('crafting_table');
                try {
                    yield this.bot.craft(recipe, timesCrafted, crafting);
                    return true;
                }
                catch (err) { }
            }
            return false;
        });
    }
    doAction(neededItem, condition, countNeeded) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentItemCount = this.getNeededItemCount(neededItem);
            //handling deprecated way of writing crafting data where condition.name is a string not an Array
            const craftingData = condition.name instanceof Array
                ? condition.name
                : [{ requiredItem: condition.name, requiredCount: condition.count }];
            const isReadyToCraft = craftingData
                .map(param => {
                const count = this.getNeededItemCount(param.requiredItem);
                return count >= param.requiredCount;
            })
                .some(param => !param);
            if (!isReadyToCraft)
                return false;
            return yield this.craftItem(neededItem, Math.ceil((countNeeded - currentItemCount) / condition.resultsIn));
        });
    }
}
exports.CraftAction = CraftAction;
