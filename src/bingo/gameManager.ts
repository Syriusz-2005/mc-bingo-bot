import { CommandInterpreter } from "../commands";

import { DefaultActions } from './actions.js';
import { math } from '../lib/math';
import { BingoBot } from "../types/bot";

import { async } from "../lib/async";

class _Block {

  found = false;
  tries = 0;
  blockId: string;
  _cmdInterpreter: CommandInterpreter;

  constructor( blockId: string, commandInterpreter: CommandInterpreter ) {
    this.blockId = blockId;
    this._cmdInterpreter = commandInterpreter;
  }

}

class BotState {
  state = '';
  possibleStates = [];

  constructor( possibleStates ) {
    this.possibleStates = possibleStates;
  }

  toggle( newState ) {
    const isState = this.possibleStates.find( state => state == newState );
    if ( !isState )
      throw new Error(`Enexpected state name ${newState}` );

    this.state = newState;
  }
}

export class GameManager {
  blockList : Map<string, _Block> = new Map();
  state = new BotState([ 'idle', 'looking' ]);
  cmdInterpreter: any;
  bot: any;
  botActions: any;
  forcedStop: boolean;
  
  constructor( commandInterperter: CommandInterpreter ) {
    this.cmdInterpreter = commandInterperter;
    this.bot = commandInterperter.bot;
    this.botActions = new DefaultActions( this.bot, this );
    this.forcedStop = false;
  }

  async analyzeTable() {
    for ( let i = 0; i <= 25; i++ ) {
      await async.wait( 900 );
      this.bot.chat(`/trigger clarify set ${i}`);
    }
  }

  addBlock( blockId ) {
    this.blockList.set( blockId, new _Block( blockId, this.cmdInterpreter )  );
  }

  forceStop() {
    this.cmdInterpreter.digManager.removeGoals();
    this.state.toggle( 'idle' );
    this.forcedStop = true;
  }

  getRandomPosition() {
    const blockToGo = this.bot.findBlock({
      maxDistance: 100,
      point: this.bot.entity.position.offset( math.randomInt( -10, 100 ), 0, math.randomInt( -10, 100 ) ),
      useExtraInfo: true,
      matching: block => {
        return block.biome.category != 'ocean';
      }
    });

    return blockToGo.position;
  }

  async playBingo( deep = 1 ) {
    await this.botActions.doActionsBeforeCollecting();

    if ( deep >= 40 )
      return;

    for ( const [ key, value ] of this.blockList ) {

      if ( this.forcedStop == true ) {
        this.forcedStop = false;
        return;
      }
      if ( value.found ) continue;

      console.log( 'finding item ', value.blockId );
      value.tries++;
      const result = await this.Get( value.blockId, 1 );
      if ( result == true ) {
        value.found = true;
        this.bot.chat(`item ${key} found!`);
      }
      await async.wait( 1000 );
    }

    const newPosition = this.getRandomPosition();

    await this.cmdInterpreter.digManager.goNearby( newPosition.x, newPosition.z );
    return await this.playBingo( deep + 1 );
  }


  async Get( itemName: string, count: number ): Promise<boolean> {
    this.state.toggle( 'looking' );
    const result = await this.cmdInterpreter.goalInterpreter.GetItem( itemName, count );
    this.state.toggle( 'idle' );
    return result;
  }

  /**
   * 
   * @param {string} winTeam 
   * @returns 
   */
  registerWin( winTeam ) {
    this.forceStop();
    winTeam = winTeam
      .replace( /G/g, 'g' )
      .replace( /R/g, 'r' )
      .replace( /B/g, 'b' )
      .replace( /Y/g, 'Y' )

    console.log( 'registered win of ' + winTeam );
    const botTeam = this.bot.teamMap[ this.bot.username ];

    if ( !botTeam ) return
    if ( botTeam.team == winTeam ) {
      this.bot.chat('I won, that was easy');
    }
  }
}