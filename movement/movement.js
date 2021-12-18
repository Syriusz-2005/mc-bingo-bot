const pathFinder = require( "mineflayer-pathfinder" );
const minecraftData = require("minecraft-data");
const goals = pathFinder.goals;
const mineflayer = require('mineflayer');

class Movement {
  #goals = goals;
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  constructor( bot ) {
    this._bot = bot;
    this.mcData = minecraftData( bot.version );
    this.defaultMove = new pathFinder.Movements( bot, this.mcData );

    bot.pathfinder.setMovements( this.defaultMove );
  }

  getGoals() {
    return this.#goals;
  }

  async goTo( goal ) {
     return await this._bot.pathfinder.goto( goal );
  }
}

exports.Movement = Movement;