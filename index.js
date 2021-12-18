const mineflayer = require( "mineflayer" );
const CommandInterpreter = require( "./commands.js" ).CommandInterperter;

const pathfinder = require( "mineflayer-pathfinder" ).pathfinder;
const autoeat = require("mineflayer-auto-eat");
const inventoryViewer = require("mineflayer-web-inventory");

const Item = require( "prismarine-item")('1.16.4');

const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'bot',
  version: '1.16.4',
});

bot.loadPlugin( pathfinder );
bot.loadPlugin( autoeat );
inventoryViewer( bot );

bot.once("spawn", () => {
  bot.autoEat.options.priority = "foodPoints";
  bot.autoEat.options.bannedFood = []
  bot.autoEat.options.eatingTimeout = 3
});

bot.on("health", () => {
  if (bot.food === 20) bot.autoEat.disable()
  // Disable the plugin if the bot is at 20 food points
  else bot.autoEat.enable() // Else enable the plugin again
});

bot.setMaxListeners( 1000 );

bot.on('kicked', console.log );
bot.on('error', console.log );

bot.on('spawn', () => {
  bot.chat('I spawned');
})

const interpreter = new CommandInterpreter( bot );
