const vec = require('vec3');
const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );

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
    this.forcedStop = true;
  }

  async playBingo() {

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

    return await this.playBingo();
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
}

exports.GameManager = GameManager;