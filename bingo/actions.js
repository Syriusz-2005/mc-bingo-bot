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
    const tools = this._gameManager.cmdInterpreter.goalInterpreter.firstItems;
    for ( const tool of tools ) {
      await this._gameManager.Get( tool.name, tool.count );
    }
  }

  async doActionsBeforeCollecting() {
    await this.#getTools();
  }
}

exports.Actions = Actions;