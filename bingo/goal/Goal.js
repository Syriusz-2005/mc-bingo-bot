const mineflayer = require( "mineflayer" );

class Goal {
  /**
   * 
   * @param {mineflayer.Bot} bot
   * @param {{
   *  type: string,
   *  name: string | Array<{ requiredItem: string, requiredCount: number }>,
   *  resultsIn ?: string,
   *  recursive ?: boolean,
   *  actionAfterResolved ?: string,
   *  count ?: number
   * }} condition
   */
  constructor( bot, condition ) {
    this._bot = bot;
    this.condition = condition;
  }

  /**
   * 
   * @param {string} itemName 
   * @returns {number}
   */
  #getItemId( itemName ) {
    return this.mcData.itemsByName[ itemName ].id;
  }

  /**
   * 
   * @param {string} itemName
   * @returns {number}
   */
  itemsInInventory( itemName ) {
    const countInInventory = this._bot.inventory.count( this.#getItemId( itemName ) );
    return countInInventory ? countInInventory : 0;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async resolve() {}
}

exports.Goal = Goal;