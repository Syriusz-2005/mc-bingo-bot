const mineflayer = require( "mineflayer" );
const DigManager = require( "./dig.js" ).DigManager;
const { GameManager } = require('./bingo/blockList.js');
const { filterNames } = require("./bingo/blockNames.js");
const { GoalInterpreter } = require('./bingo/goalInterpreter.js');

const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );

const commands = {

  '!hello' : {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {array<string>} params
     */
    run: ( user, bot, params ) => {
      bot.chat(`Hello ${user}, nice to meet you!`);
    }
  },

  '!analyze': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      bot.chat('give me a couple of seconds...');
      await cmds.gameManager.analyzeTable();
      bot.chat(`analyzing done! \n
        Registered: ${cmds.gameManager.blockList.size} items to find
      `);
      console.log( cmds.gameManager.blockList )
    }
  },

  '!winBingo': {
    /**
    * @param {string} user 
    * @param {mineflayer.Bot} bot
    * @param {array<string>} params
    */
    run: async ( user, bot, params, cmds ) => {
      bot.chat('give me a couple of minutes...');
      await cmds.gameManager.playBingo();
    }
  },

  '!forceStop': {
    /**
    * @param {string} user 
    * @param {mineflayer.Bot} bot
    * @param {array<string>} params
    */
    run: async ( user, bot, params, cmds ) => {
      bot.chat('Stopping bot...');
      await cmds.gameManager.forceStop();
    }
  },

  '!restart': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {

      bot.webInventory.stop();

      var cmd = "node " + 'index.js';

      var exec = require('child_process').exec;
      exec( cmd , function () {
        process.kill( 0 );
      });
      
    }
  },

  '!getItem': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {array<string>} params
     * @param {CommandInterperter} cmds
     */
    run: async ( user, bot, params, cmds ) => {
      const wantedBlock = params[1];
      bot.chat(`Looking for item: ${wantedBlock}`);
      const result = await cmds.gameManager.Get( wantedBlock, params[2] );
      bot.chat(`getting block resulted in ${result}`);
    }
  },

  'The': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {Array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      if ( params[1] != 'item' && params[1] != 'block' ) return;
      const itemName = filterNames(
        params
          .slice( 6, params.length )
          .reduce( ( acc, name ) => acc + '_' + name )
          .toLowerCase()
      );

      cmds.gameManager.addBlock( itemName );
    }
  },

  'Green': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {Array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Red': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {Array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Yellow': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {Array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Blue': {
    /**
     * @param {string} user 
     * @param {mineflayer.Bot} bot
     * @param {Array<string>} params
     */
    run: async ( user, bot, params, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

}


class CommandInterperter {
  #commands = commands;
  bot;
  
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  constructor( bot ) {
    this.bot = bot;
    
    this.digManager = new DigManager( bot );
    this.gameManager = new GameManager( this );
    this.goalInterpreter = new GoalInterpreter( this );

    bot.on('chat', ( user, message ) => this.#onMessage( user, message ) );
    bot.on('message', ( jsonMsg ) => {
      this.#onMessage( 'server', jsonMsg.toString() )
    });
  }

  #onMessage( user, message ) {
    const command = message.split(' ');
    if ( this.#commands[ command[0] ] )
      try {
        this.#commands[ command[0] ].run( user, this.bot, command, this );
      } catch(err) {
        console.warn( err );
      }
  }

  get commands() {
    return this.#commands;
  }
}

exports.CommandInterperter = CommandInterperter;