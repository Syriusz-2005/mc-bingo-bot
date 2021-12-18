const mineflayer = require( "mineflayer" );
const CommandInterpreter = require( "./commands.js" ).CommandInterperter;
const pathfinder = require( "mineflayer-pathfinder" ).pathfinder;
const autoeat = require("mineflayer-auto-eat");
const Item = require( "prismarine-item")('1.16.4')


const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'bot',
  version: '1.16.4',
});
bot.loadPlugin( pathfinder );
bot.loadPlugin( autoeat );

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
  const nearbyItem = bot.nearestEntity( entity => {
    if ( entity.mobType != "Item" )
      return false;

    const item = Item.fromNotch( entity.metadata[7] );
    console.log( item );

    return true;
  })
  bot.chat('I spawned');
  console.log( bot.entities );
  return;
  const entityItem = bot.nearestEntity( entity => entity.mobType == "Item" );
  console.log( entityItem.metadata[7] );
  console.log( Item.fromNotch( entityItem.metadata[7] ) );
})

const interpreter = new CommandInterpreter( bot );
