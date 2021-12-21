const { Goal } = require('./Goal.js');
const mineflayer = require('mineflayer');

class EntityNearby extends Goal {
  /**
   * 
   * @param {mineflayer.Bot} bot
   * @param {Object} condition
   */
  constructor( bot, condition ) {

    if ( condition.type != 'entityNearby' )
      throw new Error( 'condition type must be entityNearby' );

    super( bot, condition );
    this._bot = bot;

    this.mobType = condition.name;

  }

  #killEntity( entity ) {
    return new Promise( (resolve, reject) => {
      this._bot.pvp.attack( entity );

      this._bot.once('stoppedAttacking', () => {
        resolve();
      });
    });
  }

 
  #getEntityNearby() {
    const entity = this._bot.nearestEntity( entity => entity.type == 'mob' && entity.name == this.mobType );

    if ( !entity )
      throw new Error( 'Entity not found');

    return entity;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async resolve() {
    try {
      const entityToKill = this.#getEntityNearby( this.mobType );
      
      await this.#killEntity( entityToKill );
      return true;
    } catch(err) {
      console.log( err );
      return false;
    }
  }
}

exports.EntityNearby = EntityNearby;