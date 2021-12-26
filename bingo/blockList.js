const vec = require('vec3');
const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );
const { Actions } = require('./actions.js');
class _Block {

  found = false;
  tries = 0;

  constructor( blockId, commandInterpreter ) {
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

class GameManager {
  /**
   * @type {Map<string, _Block>}
   * 
   */
  blockList = new Map();
  state = new BotState([ 'idle', 'looking' ]);
  
  constructor( commandInterperter ) {
    this.cmdInterpreter = commandInterperter;
    this.bot = commandInterperter.bot;
    this.botActions = new Actions( this.bot, this );
    this.forcedStop = false;
  }

  async analyzeTable() {
    for ( let i = 0; i <= 25; i++ ) {
      await wait( 900 );
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
      await wait( 1000 );
    }

    return await this.playBingo( deep + 1 );
  }

  /**
   * 
   * @param {string} itemName 
   * @param {number} count 
   * @returns {Promise<boolean>}
   */
  async Get( itemName, count ) {
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

exports.GameManager = GameManager;