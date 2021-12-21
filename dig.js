const mineflayer = require( "mineflayer" );
const vec = require( "vec3" );
const { Movement } = require( "./movement/movement.js" );

exports.DigManager = class DigManager {
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  constructor( bot ) {
    this._bot = bot;
    this._movement = new Movement( bot );
  }

  goTo( x, y, z ) {
    return new Promise( ( resolve ) => {
      const goal = new (this._movement.getGoals().GoalBlock )( x, y, z, this._bot )
      this._movement.goTo( goal )
        .then( resolve )
        .catch( resolve );
    });
  }

  goNearby( x, z ) {
    return new Promise( ( resolve ) => {
      const goal = new (this._movement.getGoals().GoalXZ )( x, z )
      this._movement.goTo( goal )
        .then( resolve )
        .catch( resolve );
    });
  }

  async goNearbyBlock( x, y, z ) {
    const block = this._bot.blockAt( new vec( x, y, z ) );
    if ( this._bot.canDigBlock( block ) ) {
      return true;
    }

    const goal = new (this._movement.getGoals().GoalPlaceBlock)( new vec( x, y, z ), this._bot.world, {
      range: 3,
      faces: vec( 0, 1, 0 )
    });
    try {
      await this._movement.goTo( goal );
      return true;
    } catch(err) {
      return false
    }
  }


  digBlockAt( x, y, z ) {
    return new Promise( (resolve, reject) => {
      console.log('going to block');
      const blockToDig = this._bot.blockAt( new vec( x, y, z ) );
      if ( this._bot.canDigBlock( blockToDig ) ) {
        this.#tryDigBlockAt( x, y, z )
          .then( resolve );
        return;
      }
  
      try {
        const goal = new (this._movement.getGoals().GoalBreakBlock)( x, y, z, this._bot )
        this._movement.goTo( goal )
          .then( async () => {
            await this.#tryDigBlockAt( x, y, z );
            resolve();
          })
          .catch( async err => {
            console.log( err );
            await this.#tryDigBlockAt( x, y, z );
            resolve();
          });
      } catch( err ) {
        resolve();
      }
    });
  }

  async #tryDigBlockAt( x, y, z ) {
    this._bot.chat(`Digging block: ${x}, ${y}, ${z}`);
    const blockToDig = this._bot.blockAt( new vec( x, y, z ) );
    this._bot.tool.equipForBlock( blockToDig, {});
    await this._bot.dig( blockToDig );
    return true;
  }
}