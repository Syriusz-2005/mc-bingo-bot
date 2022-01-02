import * as mineflayer from "mineflayer";

import { DigManager } from "./dig.js";
import { GameManager } from './bingo/gameManager';
import { BingoBot } from "./types/bot.js";
const { filterNames } = require("./bingo/blockNames.js");
const { GoalInterpreter } = require('./bingo/goalInterpreter.js');

const commands = {

  '!hello' : {
    run: ( user: string, bot: BingoBot, params: Array<string> ) => {
      bot.chat(`Hello ${user}, nice to meet you!`);
    }
  },

  '!analyze': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds: CommandInterpreter ) => {
      bot.chat('give me a couple of seconds...');
      await cmds.gameManager.analyzeTable();
      bot.chat(`analyzing done! \n
        Registered: ${cmds.gameManager.blockList.size} items to find
      `);
      
      console.log( cmds.gameManager.blockList )
    }
  },

  '!winBingo': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds: CommandInterpreter ) => {
      bot.chat('give me a couple of minutes...');
      await cmds.gameManager.playBingo();
    }
  },

  '!forceStop': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds: CommandInterpreter ) => {
      bot.chat('Stopping bot...');
      await cmds.gameManager.forceStop();
    }
  },

  '!restart': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds: CommandInterpreter ) => {

      bot.webInventory.stop();

      var cmd = "node " + './build/index.js';

      var exec = require('child_process').exec;
      exec( cmd , function () {
        process.kill( 0 );
      });
      
    }
  },

  '!getItem': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds: CommandInterpreter ) => {
      const wantedBlock = params[1];
      bot.chat(`Looking for item: ${wantedBlock}`);
      const result = await cmds.gameManager.Get( wantedBlock, params[2] );
      bot.chat(`getting block resulted in ${result}`);
    }
  },

  'The': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds ) => {
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
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Red': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Yellow': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

  'Blue': {
    run: async ( user: string, bot: BingoBot, params: Array<string>, cmds ) => {
      if ( params[1] != 'has' || params[2] != 'gotten' ) return false;
      cmds.gameManager.registerWin( params[0] );
    }
  },

}


export class CommandInterpreter {
  private _commands = commands;
  bot: BingoBot;
  digManager: DigManager;
  gameManager: any;
  goalInterpreter: any;
  

  constructor( bot: BingoBot ) {
    this.bot = bot;
    
    this.digManager = new DigManager( bot );
    this.gameManager = new GameManager( this );
    this.goalInterpreter = new GoalInterpreter( this );

    bot.on('chat', ( user, message ) => this.onMessage( user, message ) );
    bot.on('message', ( jsonMsg ) => {
      this.onMessage( 'server', jsonMsg.toString() )
    });
  }

  private onMessage( user, message ) {
    const command = message.split(' ');
    if ( this._commands[ command[0] ] )
      try {
        this._commands[ command[0] ].run( user, this.bot, command, this );
      } catch(err) {
        console.warn( err );
      }
  }

  get commands() {
    return this._commands;
  }
}