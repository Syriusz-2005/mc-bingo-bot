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
const mineflayer_pathfinder_1 = __importDefault(require("mineflayer-pathfinder"));
const minecraft_data_1 = __importDefault(require("minecraft-data"));
const goals = mineflayer_pathfinder_1.default.goals;
const mineflayer = require('mineflayer');
class Movement {
    constructor(bot) {
        this.goals = goals;
        this.bot = bot;
        this.mcData = (0, minecraft_data_1.default)(bot.version);
        this.defaultMove = new mineflayer_pathfinder_1.default.Movements(bot, this.mcData);
        this.defaultMove.scafoldingBlocks.push(this.mcData.itemsByName['netherrack'].id);
        bot.pathfinder.setMovements(this.defaultMove);
    }
    getGoals() {
        return this.goals;
    }
    goTo(goal) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bot.pathfinder.goto(goal);
        });
    }
}
exports.Movement = Movement;
