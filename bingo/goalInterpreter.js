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

  /**
   * 
   * @param {*} name 
   * @returns {Promise<boolean>} 
   */
  async #placeBlock( name ) {
    const blockInInventory = this._bot.inventory.findInventoryItem( name, null );

    if ( !blockInInventory )
      return false;

    const blockNearby = this._bot.findBlock({
      maxDistance: 30,
      useExtraInfo: true,
      matching: bl => {
          return bl.name != 'air' 
          && this._bot.blockAt( bl.position.offset( 0, 1, 0 ) ).name == 'air' 
          && this._bot.entity.position.distanceTo( bl.position ) > 2;
      }
    });

    this._bot.pathfinder.setGoal( null );
    await this._cmds.digManager.goTo( blockNearby.position.x, blockNearby.position.y ,  blockNearby.position.z );
    await this._bot.equip( blockInInventory, 'hand' );
    this._bot.setControlState( 'jump', true );
    await wait( 380 );
    try {
      await this._bot.placeBlock( blockNearby, new vec( 0, 1, 0 ) ).catch( err => {});
    } catch(err) {
      console.warn( err );
      await this._bot.placeBlock( blockNearby, new vec( 0, 2, 0 ) ).catch( err => {});
    }
    this._bot.setControlState( 'jump', false );
    
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
  async craftItem( itemName, count = 1, recipyNumber = 0 ) {
    if ( recipyNumber >= 50 )
      return false;

    console.log( 'crafting... ' + itemName );
    const allRecipies = this._bot.recipesFor( this.#getItemId( itemName ), null, 0, true );
    const currentRecipe = allRecipies[ recipyNumber ];

    if ( !currentRecipe )
      return false;

    if ( currentRecipe.requiresTable == false ) {
      try {
        await this._bot.craft( currentRecipe, count, null );
      } catch(err) {
        return await this.craftItem( itemName, count, recipyNumber + 1 );
      }
      return true;
    }

    let blockCrafting = this._bot.findBlock({ matching: ( block ) => block.name == 'crafting_table', maxDistance: 70 });

    if ( !blockCrafting ) {
      const result = await this._cmds.goalInterpreter.GetItem( 'crafting_table', 1 );
      if ( !result )
        return false;
    
      const res = await this.#placeBlock( 'crafting_table' );
      if ( !res ) return false;

      blockCrafting = this._bot.findBlock({ matching: ( block ) => block.name == 'crafting_table' });
    }

    await this._cmds.digManager.goTo( blockCrafting.position.x, blockCrafting.position.y + 1, blockCrafting.position.z );

    try {
      await this._bot.craft( currentRecipe, count, blockCrafting );
    } catch(err) {
      console.log( err );
      return await this.craftItem( itemName, count, recipyNumber + 1 );
    }

    return true
  }

  /**
   * @param {string} itemToSmell
   * @param {number} count
   * @returns {Promise<boolean>}
   */
  async smellItem( itemToSmell, count ) {
    console.log(`smelting: ${itemToSmell}...`);

    const fuelFound = await this._cmds.goalInterpreter.GetFuel( count );
    if ( !fuelFound ) return false;

    let blockFurnace = this._bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });

    if ( !blockFurnace ) {
      const result = await this._cmds.goalInterpreter.GetItem( 'furnace', 1 );
      if ( !result )
        return false;

        const res = await this.#placeBlock( 'furnace' );
        if ( !res ) return false;
        blockFurnace = this._bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });
    }

    await this._cmds.digManager.goTo( blockCrafting.position.x, blockCrafting.position.y + 1, blockCrafting.position.z );
    const furnace = await this._bot.openFurnace( blockFurnace );

    await furnace.putFuel( this.#getItemId( fuelFound ) );
    await furnace.putInput( this.#getItemId( itemToSmell ) );
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
    console.log( 'Registered the following list of blocks: ' );
    console.log( this.goals );
  }

  async #download( pathToGoals ) {
    return JSON.parse( await fs.readFile( pathToGoals, 'utf-8' ) );
  }

  /**
   * @returns {Promise<boolean>}
   */
  async #resolveActionAfterCondition( condition, resolvingItem, count ) {
    let countOfConditionItem = 0;

    if ( !(condition.name instanceof Array) ) {
      countOfConditionItem = this.actionExecuter.isItemInInventory( condition.name );
    }

    
    switch ( condition.actionAfterResolved ) {

      case 'craft':

        if ( condition.name instanceof Array ) {
          for ( const item of condition.name ) {
            const countInInventory = this.actionExecuter.isItemInInventory( item.requiredItem );

            if ( countInInventory < item.requiredCount )
              return false;
          }
        } 

        if ( condition.count > countOfConditionItem )
          return false;

        await this.actionExecuter.craftItem( resolvingItem, Math.ceil( count / condition.resultsIn ) );
        //if the item was already crafted, nothink will happen...
        await this.GetItem( resolvingItem, count );
        
      case 'recheckConditions':
        return await this.GetItem( resolvingItem, count );

      default:
        return true;
    }

  }

  async #resolveItem( itemName, requiredCount ) {
    return await this.GetItem( itemName, requiredCount );
  }

  async #resolveItemArray( itemArray ) {
    for ( const requiredBlock of itemArray ) {
      let count = this.actionExecuter.isItemInInventory( requiredBlock.requiredItem );

      if ( count < requiredBlock.requiredCount ) {
        const gotBlock = await this.#resolveItem( requiredBlock.requiredItem, requiredBlock.requiredCount );
        //if any item cannot be optained, the whole condition will fail
        if ( gotBlock == false ) {
          return false;
        }
      }

    }
    
    return true;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async #resolveInventory( condition ) {
    //name is an array means we need multiple items to resolve condition  
    if ( condition.name instanceof Array ) {
      return await this.#resolveItemArray( condition.name );
    }

    let requiredItemCount = this.actionExecuter.isItemInInventory( condition.name );
    if ( condition.recursive == true && requiredItemCount < condition.count ) {
      return await this.#resolveItem( condition.name, condition.count );
    }
      
    return requiredItemCount == 0 ? false : true;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async #resolveCondition( condition ) {

    let coordinates;
    let result = false;

    switch ( condition.type ) {

      case 'inInventory':
        return await this.#resolveInventory( condition );
    
      case 'itemOnGround':
        coordinates = await this.actionExecuter.isItemOnGround( condition.name );

        if ( coordinates ) {
          await this.actionExecuter.goToItem( coordinates.x, coordinates.y, coordinates.z );
          result = true;
        }
        break

      case 'blockNearby':
          coordinates = await this.actionExecuter.isBlockNearby( condition.name );
          if ( coordinates ) {
            await this.actionExecuter.mineBlock( coordinates.x, coordinates.y, coordinates.z );
            result = true
          }
          break

      default:
        throw new Error('Invalid condition type');
    }

    return result;
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
      let sumInInventory = this.actionExecuter.isItemInInventory( itemToFind );

      if ( sumInInventory >= count ) {
        return true;
      }

      if ( result ) {
        await wait( 500 );
        await this.#resolveActionAfterCondition( condition, itemToFind, count );
      }
      sumInInventory = this.actionExecuter.isItemInInventory( itemToFind );

      if ( sumInInventory >= count ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 
   * @param {number} amountOfItemsToSmell 
   * @returns {Promise<string|false>}
   */
  async GetFuel( amountOfItemsToSmell ) {
    for ( const key in this.goal.items ) {
      if ( !this.goal.items[ key ].isFuel ) continue;

      const fuelNeeded = amountOfItemsToSmell / this.goal.items[ key ].smellingItemsAmount

      const isItemFound = await this.GetItem( key, fuelNeeded );
      if ( isItemFound )
        return key;
    }

    return false
  }

}

exports.GoalInterpreter = GoalInterpreter;