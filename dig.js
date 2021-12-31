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

  removeGoals() {
    this._movement.goTo( null ).catch( err => {});
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
      const goal = new (this._movement.getGoals().GoalNearXZ )( x, z, 4 )
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
      const that = this;

      function onPathUpdate( r ) {
        if ( r.status == 'noPath' ) {
          that._bot.off('path_update', onPathUpdate );
          resolve();
        }
      }

      try {
        const blockToDig = this._bot.blockAt( new vec( x, y, z ) );
        if ( this._bot.canDigBlock( blockToDig ) ) {
          this.#tryDigBlockAt( x, y, z )
            .then( resolve )
            .catch( resolve );
          return;
        }
      
        this._bot.on('path_update', onPathUpdate );

        const goal = new (this._movement.getGoals().GoalBreakBlock)( x, y, z, this._bot );
        this._movement.goTo( goal )
          .then( async () => {
            this._bot.off('path_update', onPathUpdate );
            await this.#tryDigBlockAt( x, y, z );
            resolve();
          })
          .catch( async err => {
            console.log( err );
            this._bot.off('path_update', onPathUpdate );
            await this.#tryDigBlockAt( x, y, z );
            resolve();
          });

        
      } catch( err ) {
        this._bot.off('path_update', onPathUpdate );
        resolve();
      }
    });
  }

  async #tryDigBlockAt( x, y, z ) {
    try {
      this._bot.chat(`Digging block: ${x}, ${y}, ${z}`);
      const blockToDig = this._bot.blockAt( new vec( x, y, z ) );
      this._bot.tool.equipForBlock( blockToDig, {});
      await this._bot.dig( blockToDig );
      return true;
    } catch( err ) {
      return true;
    }
  }
}