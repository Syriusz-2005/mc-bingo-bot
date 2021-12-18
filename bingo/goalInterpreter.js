const fs = require('fs/promises');
const mineflayer = require('mineflayer');
const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );

class ActionExecuter {
  /**
   * 
   * @param {CommandInterpreter} cmds
   */
  constructor( cmds ) {
    this._cmds = cmds;
    this.#setBot( cmds.bot );
    this.mcData = require('minecraft-data')( cmds.bot.version );
    this.Item = require( "prismarine-item")( cmds.bot.version );
  }
  
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  #setBot( bot ) {
    this._bot = bot;
  }
  //as easy as it looks!
  
  async craftItem( itemName, count = 1 ) {
    const recipe = this._bot.recipesFor( this.mcData.itemsByName[ itemName ].id )[0];
    //TODO: clearly, much more work to be done here ( selecting right recipe and using crafting table )
    await this._bot.craft( recipe, count, null );
    return true;
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Promise<boolean>} 
   */
  async goToItem( x, y, z ) {  
    await this._cmds.digManager.goTo( x, y, z );
    return true;
  }
  
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Promise<boolean>} 
   */
  async mineBlock( x, y, z ) {
    await this._cmds.digManager.digBlockAt( x, y, z );
    return true;
  }
  
    /**
   * 
   * @param {string} itemName
   * @param {number} count
   * @returns {Promise<boolean>} 
   */
  isItemInInventory( itemName, count = 1 ) {
    const countInInventory = this._bot.inventory.count( this.mcData.itemsByName[ itemName ].id );
    return countInInventory >= count ? true : false;
  }

  /**
   * 
   * @param {string} itemName
   * @param {number} count
   * @returns {Promise<boolean|{x, y, z}>} 
   */
  async isItemOnGround( itemName, count = 1 ) {
    let overallCount = 0;

    const nearestEntity = this._bot.nearestEntity( entity => {
      if ( entity.mobType != "Item" )
        return false;

      const item = this.Item.fromNotch( entity.metadata[7] );

      if ( item.name == itemName ) {
        overallCount = item.count;
        return true;
      }

      return false;
    });
    
    if ( !nearestEntity )
      return false;

    return nearestEntity.position;
  }

  
  /**
   * 
   * @param {string} blockName
   * @param {number} count
   * @returns {Promise<boolean|{x, y, z}>} 
   */
  async isBlockNearby( blockName, count = 1 ) {
    const wantedBlock = this._bot.findBlock({
      matching: ( block ) => block.name == blockName,
      maxDistance: 150
    });
    if ( !wantedBlock )
      return false;

    return wantedBlock.position;
  }
}

class GoalInterpreter {

  constructor( cmds, pathToGoals = './bingo/goals.json' ) {
    this._cmds = cmds;
    this.actionExecuter = new ActionExecuter( cmds );

    this.pathToGoals = pathToGoals;
    this.#prepare();
  }

  async #prepare() {
    this.goals = await this.#download( this.pathToGoals );
    console.log( this.goals );
  }

  async #download( pathToGoals ) {
    return JSON.parse( await fs.readFile( pathToGoals, 'utf-8' ) );
  }

  /**
   * @returns {Promise<boolean>}
   */
  async #resolveActionAfterCondition( condition, resolvingItem ) {

    switch ( condition.actionAfterResolved ) {

      case 'craft':
        return await this.actionExecuter.craftItem( resolvingItem );

      case 'recheckConditions':
        return await this.GetItem( resolvingItem );

      default:
        return true;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async #resolveCondition( condition, count ) {

    let coordinates;
    
    switch ( condition.type ) {

      case 'inInventory':
        if ( this.actionExecuter.isItemInInventory( condition.name, condition.count ) )
          return true;
        if ( condition.recursive == true )
          return await this.GetItem( condition.name, condition.count );
        return false;
    
      case 'itemOnGround':
        coordinates = await this.actionExecuter.isItemOnGround( condition.name, condition.count );
        if ( coordinates ) {
          return await this.actionExecuter.goToItem( coordinates.x, coordinates.y, coordinates.z );
        }
        return false;

      case 'blockNearby':
        coordinates = await this.actionExecuter.isBlockNearby( condition.name, condition.count );
          if ( coordinates ) {
            return await this.actionExecuter.mineBlock( coordinates.x, coordinates.y, coordinates.z );
          }

        return false;

      default:
        throw new Error('Invalid condition type');
    }
  }

  /**
   * 
   * @param {string} itemToFind
   * @returns {Promise<boolean>}
   */
  async GetItem( itemToFind, count = 1 ) {
    const item = this.goals.items[ itemToFind ];
    
    if ( !item )
      return false;
    
    for ( const condition of item.conditions ) {
      const result = await this.#resolveCondition( condition, count );
      if ( result == true ) {
        await wait( 500 );
        return await this.#resolveActionAfterCondition( condition, itemToFind );
      } else
        continue

    }
  }

}

exports.GoalInterpreter = GoalInterpreter;