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
exports.DigManager = void 0;
const vec = require("vec3");
const { Movement } = require("./movement/movement.js");
class DigManager {
    constructor(bot) {
        this.bot = bot;
        this.movement = new Movement(bot);
    }
    removeGoals() {
        this.movement.goTo(null).catch(err => { });
    }
    goTo(x, y, z) {
        return new Promise((resolve) => {
            const goal = new (this.movement.getGoals().GoalBlock)(x, y, z, this.bot);
            this.movement.goTo(goal)
                .then(resolve)
                .catch(resolve);
        });
    }
    goNearby(x, z) {
        return new Promise((resolve) => {
            const goal = new (this.movement.getGoals().GoalNearXZ)(x, z, 4);
            this.movement.goTo(goal)
                .then(resolve)
                .catch(resolve);
        });
    }
    goNearbyBlock(x, y, z) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = this.bot.blockAt(new vec(x, y, z));
            if (this.bot.canDigBlock(block)) {
                return true;
            }
            const goal = new (this.movement.getGoals().GoalPlaceBlock)(new vec(x, y, z), this.bot.world, {
                range: 3,
            });
            try {
                yield this.movement.goTo(goal);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    digBlockAt(x, y, z) {
        return new Promise((resolve, reject) => {
            const that = this;
            function onPathUpdate(r) {
                if (r.status == 'noPath') {
                    that.bot.off('path_update', onPathUpdate);
                    resolve();
                }
            }
            try {
                const blockToDig = this.bot.blockAt(new vec(x, y, z));
                if (this.bot.canDigBlock(blockToDig)) {
                    this.tryDigBlockAt(x, y, z)
                        .then(resolve)
                        .catch(resolve);
                    return;
                }
                this.bot.on('path_update', onPathUpdate);
                const goal = new (this.movement.getGoals().GoalBreakBlock)(x, y, z, this.bot);
                this.movement.goTo(goal)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    this.bot.off('path_update', onPathUpdate);
                    yield this.tryDigBlockAt(x, y, z);
                    resolve();
                }))
                    .catch((err) => __awaiter(this, void 0, void 0, function* () {
                    console.log(err);
                    this.bot.off('path_update', onPathUpdate);
                    yield this.tryDigBlockAt(x, y, z);
                    resolve();
                }));
            }
            catch (err) {
                this.bot.off('path_update', onPathUpdate);
                resolve();
            }
        });
    }
    tryDigBlockAt(x, y, z) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.bot.chat(`Digging block: ${x}, ${y}, ${z}`);
                const blockToDig = this.bot.blockAt(new vec(x, y, z));
                this.bot.tool.equipForBlock(blockToDig, {});
                yield this.bot.dig(blockToDig);
                return true;
            }
            catch (err) {
                return true;
            }
        });
    }
}
exports.DigManager = DigManager;
