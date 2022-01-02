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
exports.GameManager = void 0;
const actions_js_1 = require("./actions.js");
const math_1 = require("../lib/math");
const async_1 = require("../lib/async");
class _Block {
    constructor(blockId, commandInterpreter) {
        this.found = false;
        this.tries = 0;
        this.blockId = blockId;
        this._cmdInterpreter = commandInterpreter;
    }
}
class BotState {
    constructor(possibleStates) {
        this.state = '';
        this.possibleStates = [];
        this.possibleStates = possibleStates;
    }
    toggle(newState) {
        const isState = this.possibleStates.find(state => state == newState);
        if (!isState)
            throw new Error(`Enexpected state name ${newState}`);
        this.state = newState;
    }
}
class GameManager {
    constructor(commandInterperter) {
        this.blockList = new Map();
        this.state = new BotState(['idle', 'looking']);
        this.cmdInterpreter = commandInterperter;
        this.bot = commandInterperter.bot;
        this.botActions = new actions_js_1.DefaultActions(this.bot, this);
        this.forcedStop = false;
    }
    analyzeTable() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i <= 25; i++) {
                yield async_1.async.wait(900);
                this.bot.chat(`/trigger clarify set ${i}`);
            }
        });
    }
    addBlock(blockId) {
        this.blockList.set(blockId, new _Block(blockId, this.cmdInterpreter));
    }
    forceStop() {
        this.cmdInterpreter.digManager.removeGoals();
        this.state.toggle('idle');
        this.forcedStop = true;
    }
    getRandomPosition() {
        const blockToGo = this.bot.findBlock({
            maxDistance: 100,
            point: this.bot.entity.position.offset(math_1.math.randomInt(-10, 100), 0, math_1.math.randomInt(-10, 100)),
            useExtraInfo: true,
            matching: block => {
                return block.biome.category != 'ocean';
            }
        });
        return blockToGo.position;
    }
    playBingo(deep = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.botActions.doActionsBeforeCollecting();
            if (deep >= 40)
                return;
            for (const [key, value] of this.blockList) {
                if (this.forcedStop == true) {
                    this.forcedStop = false;
                    return;
                }
                if (value.found)
                    continue;
                console.log('finding item ', value.blockId);
                value.tries++;
                const result = yield this.Get(value.blockId, 1);
                if (result == true) {
                    value.found = true;
                    this.bot.chat(`item ${key} found!`);
                }
                yield async_1.async.wait(1000);
            }
            const newPosition = this.getRandomPosition();
            yield this.cmdInterpreter.digManager.goNearby(newPosition.x, newPosition.z);
            return yield this.playBingo(deep + 1);
        });
    }
    Get(itemName, count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.toggle('looking');
            const result = yield this.cmdInterpreter.goalInterpreter.GetItem(itemName, count);
            this.state.toggle('idle');
            return result;
        });
    }
    /**
     *
     * @param {string} winTeam
     * @returns
     */
    registerWin(winTeam) {
        this.forceStop();
        winTeam = winTeam
            .replace(/G/g, 'g')
            .replace(/R/g, 'r')
            .replace(/B/g, 'b')
            .replace(/Y/g, 'Y');
        console.log('registered win of ' + winTeam);
        const botTeam = this.bot.teamMap[this.bot.username];
        if (!botTeam)
            return;
        if (botTeam.team == winTeam) {
            this.bot.chat('I won, that was easy');
        }
    }
}
exports.GameManager = GameManager;
