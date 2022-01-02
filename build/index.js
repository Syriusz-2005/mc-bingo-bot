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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer = require('mineflayer');
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const commands_1 = require("./commands");
const async_1 = require("./lib/async");
const mineflayer_auto_eat_1 = __importDefault(require("mineflayer-auto-eat"));
const toolPlugin = require('mineflayer-tool').plugin;
const pvp = require('mineflayer-pvp').plugin;
const inventoryViewer = require("mineflayer-web-inventory");
const botName = ((_a = process.argv.find(argument => argument.startsWith('name='))) === null || _a === void 0 ? void 0 : _a.split('=')[1]) || 'bot';
const host = ((_b = process.argv.find(argument => argument.startsWith('host='))) === null || _b === void 0 ? void 0 : _b.split('=')[1]) || 'localhost';
const version = ((_c = process.argv.find(argument => argument.startsWith('version='))) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || '1.16.4';
console.log('Bot params: ');
console.log({ botName, host, version });
console.log('To change bot params, type <paramName>=<paramValue>');
const bot = mineflayer.createBot({
    host: host,
    username: botName,
    version: version,
    hideErrors: true
});
bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(mineflayer_auto_eat_1.default);
bot.loadPlugin(toolPlugin);
try {
    inventoryViewer(bot, {
        port: 3000
    });
}
catch (err) { }
bot.once("spawn", () => {
    bot.chat('Loading done!');
    bot.autoEat.options.priority = "foodPoints";
    bot.autoEat.options.bannedFood = ["spider_eye"];
    bot.autoEat.options.eatingTimeout = 3;
});
bot.on("health", () => {
    if (bot.food === 20)
        bot.autoEat.disable();
    // Disable the plugin if the bot is at 20 food points
    else
        bot.autoEat.enable(); // Else enable the plugin again
});
bot.setMaxListeners(1000);
bot.on('kicked', console.log);
bot.on('error', console.log);
const interpreter = new commands_1.CommandInterpreter(bot);
bot.on('death', () => __awaiter(void 0, void 0, void 0, function* () {
    bot.pathfinder.stop();
    yield async_1.async.wait(1500);
}));
