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
exports.CommandInterpreter = void 0;
const dig_js_1 = require("./dig.js");
const gameManager_1 = require("./bingo/gameManager");
const { filterNames } = require("./bingo/blockNames.js");
const { GoalInterpreter } = require('./bingo/goalInterpreter.js');
const commands = {
    '!hello': {
        run: (user, bot, params) => {
            bot.chat(`Hello ${user}, nice to meet you!`);
        }
    },
    '!analyze': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            bot.chat('give me a couple of seconds...');
            yield cmds.gameManager.analyzeTable();
            bot.chat(`analyzing done! \n
        Registered: ${cmds.gameManager.blockList.size} items to find
      `);
            console.log(cmds.gameManager.blockList);
        })
    },
    '!winBingo': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            bot.chat('give me a couple of minutes...');
            yield cmds.gameManager.playBingo();
        })
    },
    '!forceStop': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            bot.chat('Stopping bot...');
            yield cmds.gameManager.forceStop();
        })
    },
    '!restart': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            bot.webInventory.stop();
            var cmd = "node " + './build/index.js';
            var exec = require('child_process').exec;
            exec(cmd, function () {
                process.kill(0);
            });
        })
    },
    '!getItem': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            const wantedBlock = params[1];
            bot.chat(`Looking for item: ${wantedBlock}`);
            const result = yield cmds.gameManager.Get(wantedBlock, params[2]);
            bot.chat(`getting block resulted in ${result}`);
        })
    },
    'The': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            if (params[1] != 'item' && params[1] != 'block')
                return;
            const itemName = filterNames(params
                .slice(6, params.length)
                .reduce((acc, name) => acc + '_' + name)
                .toLowerCase());
            cmds.gameManager.addBlock(itemName);
        })
    },
    'Green': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            if (params[1] != 'has' || params[2] != 'gotten')
                return false;
            cmds.gameManager.registerWin(params[0]);
        })
    },
    'Red': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            if (params[1] != 'has' || params[2] != 'gotten')
                return false;
            cmds.gameManager.registerWin(params[0]);
        })
    },
    'Yellow': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            if (params[1] != 'has' || params[2] != 'gotten')
                return false;
            cmds.gameManager.registerWin(params[0]);
        })
    },
    'Blue': {
        run: (user, bot, params, cmds) => __awaiter(void 0, void 0, void 0, function* () {
            if (params[1] != 'has' || params[2] != 'gotten')
                return false;
            cmds.gameManager.registerWin(params[0]);
        })
    },
};
class CommandInterpreter {
    constructor(bot) {
        this._commands = commands;
        this.bot = bot;
        this.digManager = new dig_js_1.DigManager(bot);
        this.gameManager = new gameManager_1.GameManager(this);
        this.goalInterpreter = new GoalInterpreter(this);
        bot.on('chat', (user, message) => this.onMessage(user, message));
        bot.on('message', (jsonMsg) => {
            this.onMessage('server', jsonMsg.toString());
        });
    }
    onMessage(user, message) {
        const command = message.split(' ');
        if (this._commands[command[0]])
            try {
                this._commands[command[0]].run(user, this.bot, command, this);
            }
            catch (err) {
                console.warn(err);
            }
    }
    get commands() {
        return this._commands;
    }
}
exports.CommandInterpreter = CommandInterpreter;
