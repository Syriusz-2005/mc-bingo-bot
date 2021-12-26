const mineflayer = require( "mineflayer" );

class Actions {
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  constructor( bot, gameManager ) {
    this._bot = bot;
    this._gameManager = gameManager;
  }

  async #getTools() {
    await this._gameManager.Get( 'iron_ingot', 15 );
    await this._gameManager.Get( 'iron_pickaxe', 1 );
    await this._gameManager.Get( 'iron_shovel', 1 );
    await this._gameManager.Get( 'iron_axe', 1 );
  }

  async doActionsBeforeCollecting() {
    await this.#getTools();
  }
}

exports.Actions = Actions;