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
exports.EntityNearby = void 0;
const Goal_js_1 = require("./Goal.js");
class EntityNearby extends Goal_js_1.Goal {
    constructor(bot, condition) {
        super(bot, condition);
        if (condition.type != 'entityNearby')
            throw new Error('condition type must be entityNearby');
        this.mobType = condition.name;
    }
    killEntity(entity) {
        return new Promise((resolve, reject) => {
            this.bot.pvp.attack(entity);
            this.bot.once('stoppedAttacking', () => {
                resolve();
            });
        });
    }
    getEntityNearby() {
        const entity = this.bot.nearestEntity(entity => entity.type == 'mob' && entity.name == this.mobType);
        if (!entity)
            throw new Error('Entity not found');
        return entity;
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entityToKill = this.getEntityNearby();
                yield this.killEntity(entityToKill);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.EntityNearby = EntityNearby;
