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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var mineflayer = require('mineflayer');
var mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
var commands_1 = require("./commands");
var async_1 = require("./lib/async");
var mineflayer_auto_eat_1 = __importDefault(require("mineflayer-auto-eat"));
var toolPlugin = require('mineflayer-tool').plugin;
var pvp = require('mineflayer-pvp').plugin;
var inventoryViewer = require("mineflayer-web-inventory");
var botName = ((_a = process.argv.find(function (argument) { return argument.startsWith('name='); })) === null || _a === void 0 ? void 0 : _a.split('=')[1]) || 'bot';
var host = ((_b = process.argv.find(function (argument) { return argument.startsWith('host='); })) === null || _b === void 0 ? void 0 : _b.split('=')[1]) || 'localhost';
var version = ((_c = process.argv.find(function (argument) { return argument.startsWith('version='); })) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || '1.16.4';
console.log('Bot params: ');
console.log({ botName: botName, host: host, version: version });
console.log('To change bot params, type <paramName>=<paramValue>');
var bot = mineflayer.createBot({
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
bot.once("spawn", function () {
    bot.chat('Loading done!');
    bot.autoEat.options.priority = "foodPoints";
    bot.autoEat.options.bannedFood = ["spider_eye"];
    bot.autoEat.options.eatingTimeout = 3;
});
bot.on("health", function () {
    if (bot.food === 20)
        bot.autoEat.disable();
    // Disable the plugin if the bot is at 20 food points
    else
        bot.autoEat.enable(); // Else enable the plugin again
});
bot.setMaxListeners(1000);
bot.on('kicked', console.log);
bot.on('error', console.log);
var interpreter = new commands_1.CommandInterpreter(bot);
bot.on('death', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bot.pathfinder.stop();
                return [4 /*yield*/, async_1.async.wait(1500)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
