const Goal = require('./Goal.js');
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

  /**
   * 
   * @param {string} mobType 
   */
  #getEntityNearby( mobType ) {
    const entity = this._bot.nearestEntity( entity => entity.type == 'mob' && entity.mobType == this.mobType );

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
      
      
    } catch(err) {
      return false;
    }
  }
}

exports.EntityNearby = EntityNearby;