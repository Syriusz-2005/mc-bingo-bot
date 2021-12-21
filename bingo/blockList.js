const vec = require('vec3');
const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );

class _Block {

  lastSeen = new vec( 0, 0, 0 );
  lastDistance = Infinity;
  found = false;

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
  blockList = new Map();
  state = new BotState([ 'idle', 'looking' ]);

  constructor( commandInterperter ) {
    this.cmdInterpreter = commandInterperter;
    this.bot = commandInterperter.bot;
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

  
  async Get( itemName, count ) {
    this.state.toggle( 'looking' );
    const result = await this.cmdInterpreter.goalInterpreter.GetItem( itemName, count );
    this.state.toggle( 'idle' );
    return result;
  }
}

exports.GameManager = GameManager;