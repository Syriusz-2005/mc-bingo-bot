const mineflayer = require( "mineflayer" );
const CommandInterpreter = require( "./commands.js" ).CommandInterperter;
const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );

const pathfinder = require( "mineflayer-pathfinder" ).pathfinder;
const autoeat = require("mineflayer-auto-eat");
const toolPlugin = require('mineflayer-tool').plugin;
const pvp = require( 'mineflayer-pvp' ).plugin;
const inventoryViewer = require("mineflayer-web-inventory");

const name = process.argv.find( argument => argument.startsWith('name=') )?.split('=')[1] || 'bot';
const host = process.argv.find( argument => argument.startsWith('host=') )?.split('=')[1] || 'localhost';
const version =  process.argv.find( argument => argument.startsWith('version=') )?.split('=')[1] || '1.16.4';

console.log('Bot params: ');
console.log({ name, host, version });
console.log( 'To change bot params, type <paramName>=<paramValue>' );

const bot = mineflayer.createBot({
  host: host,
  username: name,
  version: version,
  hideErrors: true
});

bot.loadPlugin( pathfinder );
bot.loadPlugin( pvp );
bot.loadPlugin( autoeat );
bot.loadPlugin( toolPlugin );
try {
  inventoryViewer( bot, {
    port: 3000
  });
} catch(err) {}

bot.once("spawn", () => {
  bot.chat('Loading done!');
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

const interpreter = new CommandInterpreter( bot );

bot.on('death', async () => {
  bot.pathfinder.stop();
  await wait( 1500 );
});

bot.on('path_update', ( r ) => {
  const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
  // console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${r.visitedNodes} nodes, ${nodesPerTick} nodes/tick) status: ${r.status}`)
});

bot.on('path_reset', reason => {
  // console.log(`stopped, reason: `, reason );
})