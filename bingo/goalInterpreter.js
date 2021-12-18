const fs = require('fs/promises');
const mineflayer = require('mineflayer');
const { Item } = require('prismarine-item');
const vec = require('vec3');
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

  #getItemId( name ) {
    return this.mcData.itemsByName[ name ].id
  }

  async #placeBlock( name ) {
    const blockInInventory = this._bot.inventory.findInventoryItem( name, null );

    if ( !blockInInventory )
      return false;

    const blockNearby = this._bot.findBlock({ matching: ( block ) => block.name != 'air' });
    
    await this._bot.equip( blockInInventory, 'hand' );

    for ( let x = 0; x <= 1; x++ )
      for ( let y = 0; y <= 1; y++ )
        for ( let z = 0; z <= 1; z++ ) {
          try {
            await this._bot.placeBlock( blockNearby, new vec( x, y, z ) )
            return true;
          } catch( err ) { console.log( err ) }
        }
  }
  
  /**
   * 
   * @param {mineflayer.Bot} bot 
   */
  #setBot( bot ) {
    this._bot = bot;
  }
  //as easy as it looks!
  
  /**
   * 
   * @param {*} itemName 
   * @param {*} count 
   * @returns {Promise<boolean>}
   */
  async craftItem( itemName, count = 1 ) {
    console.log( 'crafting... ' + itemName );
    const allRecipies = this._bot.recipesFor( this.#getItemId( itemName ), null, 0, true );
    const recipeWithoutCrafting = allRecipies.find( r => r.requiresTable == false );

    if ( recipeWithoutCrafting ) {
      await this._bot.craft( recipeWithoutCrafting, count, null );
      return true;
    }

    let blockCrafting = this._bot.findBlock({ matching: ( block ) => block.name == 'crafting_table' });

    if ( !blockCrafting ) {
      const result = await this._cmds.goalInterpreter.GetItem( 'crafting_table', 1 );
      if ( !result )
        return false;
    
      const res = await this.#placeBlock( 'crafting_table' );
      if ( !res ) return false;

      blockCrafting = this._bot.findBlock({ matching: ( block ) => block.name == 'crafting_table' });
    }

    this._bot.craft( allRecipies[0], count, blockCrafting );
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
   * @returns {number} 
   */
  isItemInInventory( itemName ) {
    const countInInventory = this._bot.inventory.count( this.mcData.itemsByName[ itemName ].id );
    return countInInventory ? countInInventory : 0;
  }

  /**
   * 
   * @param {string} itemName
   * @param {number} count
   * @returns {Promise<boolean|{x, y, z, count}>} 
   */
  async isItemOnGround( itemName ) {
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

    nearestEntity.position.count = overallCount;
    return nearestEntity.position;
  }

  
  /**
   * 
   * @param {string} blockName
   * @param {number} count
   * @returns {Promise<boolean|{x, y, z}>} 
   */
  async isBlockNearby( blockName ) {
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
  async #resolveActionAfterCondition( condition, resolvingItem, count, currentItemCount ) {

    switch ( condition.actionAfterResolved ) {

      case 'craft':

        if (condition.count > currentItemCount )
          return false;
      
        return await this.actionExecuter.craftItem( resolvingItem, count );

      case 'recheckConditions':
        return await this.GetItem( resolvingItem );

      default:
        return true;
    }
  }

  /**
   * @returns {Promise<number>}
   */
  async #resolveCondition( condition ) {

    let coordinates;
    let recursiveResult = false;
    let result;

    switch ( condition.type ) {

      case 'inInventory':
        result = this.actionExecuter.isItemInInventory( condition.name );

        if ( condition.recursive == true && result < condition.count ) {
          recursiveResult = await this.GetItem( condition.name, condition.count );
        }
        break
    
      case 'itemOnGround':
        coordinates = await this.actionExecuter.isItemOnGround( condition.name );

        if ( coordinates ) {
          await this.actionExecuter.goToItem( coordinates.x, coordinates.y, coordinates.z );
          result = coordinates.count;
        }
        break

      case 'blockNearby':
          coordinates = await this.actionExecuter.isBlockNearby( condition.name );
          if ( coordinates ) {
            await this.actionExecuter.mineBlock( coordinates.x, coordinates.y, coordinates.z );
          }
          break

      default:
        throw new Error('Invalid condition type');
    }

    return recursiveResult == false ? this.actionExecuter.isItemInInventory( condition.name ) : condition.count;
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
    
    let sum = 0;
    for ( const condition of item.conditions ) {
      sum = await this.#resolveCondition( condition, count );
      console.log( { for: itemToFind, sum, type: condition.type } );
      if ( sum > 0 ) {
        await wait( 500 );
        await this.#resolveActionAfterCondition( condition, itemToFind, count, sum );
      }

      if ( sum >= count ) {
        return true;
      }
    }
  }

}

exports.GoalInterpreter = GoalInterpreter;