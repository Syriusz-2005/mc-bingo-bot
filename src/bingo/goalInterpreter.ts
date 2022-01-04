const fs = require('fs/promises');
import { Vec3 } from 'vec3';
const vec = require('vec3');

const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );
import minecraftData, { IndexedData } from "minecraft-data";


import { EntityNearby } from './goal/entityNearby';
import { CommandInterpreter } from "../commands";
import { BingoBot } from "../types/bot";
import { Item } from 'prismarine-item';
const getItem = require("prismarine-item");

class CountVector extends vec {
  public count: number;

  constructor( x: number, y: number, z: number, count: number ) {
    super( x, y, z );
    this.count = count;
  }
}

class ActionExecuter {
  private cmds: CommandInterpreter;
  mcData: IndexedData;
  private bot: BingoBot;
  Item: typeof Item;

  constructor( cmds: CommandInterpreter ) {
    this.cmds = cmds;
    this.setBot( cmds.bot );
    this.mcData = minecraftData( cmds.bot.version );
    this.Item = getItem( cmds.bot.version );
  }

  private getItemId( name: string ) {
    return this.mcData.itemsByName[ name ].id
  }


  private async placeBlock( name: string ): Promise<boolean> {
    const blockInInventory = this.bot.inventory.findInventoryItem( name, null, false );

    if ( !blockInInventory )
      return false;

    const blockNearby = this.bot.findBlock({
      maxDistance: 30,
      useExtraInfo: true,
      matching: bl => {
          return bl.name != 'air' 
          && bl.name != 'water'
          && bl.name != 'lava'
          && bl.name != 'dead_bush'
          && bl.boundingBox == 'block'
          && this.bot.blockAt( bl.position.offset( 0, 1, 0 ) ).name == 'air' 
          && this.bot.entity.position.distanceTo( bl.position ) > 2;
      }
    });
    
    this.bot.pathfinder.setGoal( null );
    await this.cmds.digManager.goNearbyBlock( blockNearby.position.x, blockNearby.position.y,  blockNearby.position.z );
    if ( this.bot.inventory.emptySlotCount() == 0 ) {
      //TODO: remove one item from inventory
    }
    await this.bot.unequip( 'hand' );
    await this.bot.equip( blockInInventory, 'hand' );
    try {
      await this.bot.placeBlock( blockNearby, new Vec3( 0, 1, 0 ) );
    } catch(err) {
      console.log(err);
    }

    return true;
  }
  

  private setBot( bot: BingoBot ) {
    this.bot = bot;
  }
  

  async craftItem( itemName: string, count: number = 1, recipyNumber = 0 ): Promise<boolean> {
    if ( recipyNumber >= 50 )
      return false;

    console.log( 'crafting... ' + itemName );
    const allRecipies = this.bot.recipesFor( this.getItemId( itemName ), null, 0, true );
    const currentRecipe = allRecipies[ recipyNumber ];

    if ( !currentRecipe )
      return false;

    if ( currentRecipe.requiresTable == false ) {
      try {
        await this.bot.craft( currentRecipe, count, null );
      } catch(err) {
        return await this.craftItem( itemName, count, recipyNumber + 1 );
      }
      return true;
    }

    let blockCrafting = this.bot.findBlock({ matching: ( block ) => block.name == 'crafting_table', maxDistance: 70 });

    if ( !blockCrafting ) {
      const result = await this.cmds.goalInterpreter.GetItem( 'crafting_table', 1 );
      if ( !result )
        return false;
    
      const res = await this.placeBlock( 'crafting_table' );
      if ( !res ) return false;

      blockCrafting = this.bot.findBlock({ matching: ( block ) => block.name == 'crafting_table' });
    }

    if ( !blockCrafting ) {
      return await this.craftItem( itemName, count, recipyNumber );
    }

    await this.cmds.digManager.goTo( blockCrafting.position.x, blockCrafting.position.y + 1, blockCrafting.position.z );

    try {
      await this.bot.craft( currentRecipe, count, blockCrafting );
    } catch(err) {
      console.log( err );
      return await this.craftItem( itemName, count, recipyNumber + 1 );
    }

    return true
  }

  smellItem( itemToSmell: string, count: number ): Promise<boolean> {
    return new Promise( async ( resolve ) => {
      console.log(`smelting: ${itemToSmell}...`);
  
      let blockFurnace = this.bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });
  
      if ( !blockFurnace ) {
        const result = await this.cmds.goalInterpreter.GetItem( 'furnace', 1 );
        if ( !result ) {
          resolve( false )
          return;
        }
  
          const res = await this.placeBlock( 'furnace' );
          if ( !res ) { 
            resolve( false );
            return
          }
          blockFurnace = this.bot.findBlock({ matching: block => block.name == 'furnace', maxDistance: 70 });
      }

      if ( !blockFurnace ) {
        return await this.smellItem( itemToSmell, count );
      }

      const fuelData = await this.cmds.goalInterpreter.GetFuel( count ).catch(err => resolve( false ) );
  
      await this.cmds.digManager.goTo( blockFurnace.position.x, blockFurnace.position.y + 1, blockFurnace.position.z );
      const furnace = await this.bot.openFurnace( blockFurnace );
      
      await furnace.takeOutput( null ).catch( err => {} );
      await furnace.putFuel( this.getItemId( fuelData.item ), 0, fuelData.count ).catch( err => {});
      await furnace.putInput( this.getItemId( itemToSmell ), 0, count ).catch( err => {} );

      async function onUpdate() {
        const item = furnace.outputItem();
        if ( !item ) return;
        
        if ( item.count >= count ) {
          try {
            furnace.off('update', onUpdate );
            await furnace.takeOutput( null );

            furnace.close();
            resolve( true );
          } catch(err) {
            console.warn( err );
          }
        }
      }

      furnace.on( 'update', onUpdate );
    });
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Promise<boolean>} 
   */
  async goToItem( x: number, y: number, z: number ): Promise<boolean> {  
    await this.cmds.digManager.goTo( x, y, z );
    return true;
  }
  
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @returns {Promise<boolean>} 
   */
  async mineBlock( x: number, y: number, z: number ): Promise<boolean> {
    await this.cmds.digManager.digBlockAt( x, y, z );
    return true;
  }
  
    /**
   * 
   * @param {string} itemName
   * @param {number} count
   * @returns {number} 
   */
  isItemInInventory( itemName: string ): number {
    try {
      const countInInventory = this.bot.inventory.count( this.getItemId( itemName ), null );
      return countInInventory ? countInInventory : 0;
    } catch( err ) {
      console.warn( `Item ${itemName} is not registered in minecraft data, cannot find item` );
      console.warn( err );
      return 0;
    }
  }

  async isItemOnGround( itemName: string ): Promise<boolean | CountVector> {
    let overallCount = 0;

    const nearestEntity = this.bot.nearestEntity( entity => {
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

    return new CountVector( 
        nearestEntity.position.x,
        nearestEntity.position.y,
        nearestEntity.position.z,
        overallCount
     );
  }


  async isBlockNearby( blockName: string ): Promise<boolean | Vec3> {
    const wantedBlock = this.bot.findBlock({
      matching: ( block ) => block.name == blockName,
      maxDistance: 150
    });
    if ( !wantedBlock )
      return false;

    return wantedBlock.position;
  }
}

class GoalInterpreter {
  private cmds: any;
  actionExecuter: ActionExecuter;
  pathToGoals: string;
  goals: any;
  firstItems: any;

  constructor( cmds, pathToGoals =  './build/bingo/goals.json' ) {
    this.cmds = cmds;
    this.actionExecuter = new ActionExecuter( cmds );

    this.pathToGoals = pathToGoals;
    this.prepare();
  }

  private logBlocks() {
    let list = '';
    for ( const itemName in this.goals.items )
      list += `, ${itemName}`;

    console.log( list );
  }

  private async prepare() {
    this.goals = await this.download( this.pathToGoals );
    this.firstItems = this.goals.config.itemsBotNeeds;
    console.log( 'Registered the following list of blocks: ' );
    this.logBlocks();
  }

  private async download( pathToGoals ) : Promise<any> {
    return JSON.parse( await fs.readFile( pathToGoals, 'utf-8' ) );
  }


  async resolveActionAfterCondition( condition, resolvingItem, count ): Promise<boolean> {
    let countOfConditionItem = 0;

    // also second condition because name is not always the item, name ( could be entity name )
    if ( !(condition.name instanceof Array) && this.goals.items[ condition.name ] ) {
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
        return await this.GetItem( resolvingItem, count );

      case 'smell':
        return await this.actionExecuter.smellItem( condition.name, count );
        
      case 'recheckConditions':
        return await this.GetItem( resolvingItem, count );

      default:
        return true;
    }

  }

  private async resolveItem( itemName, requiredCount ) {
    return await this.GetItem( itemName, requiredCount );
  }

  private async resolveItemArray( itemArray ) {
    for ( const requiredBlock of itemArray ) {
      let count = this.actionExecuter.isItemInInventory( requiredBlock.requiredItem );

      if ( count < requiredBlock.requiredCount ) {
        const gotBlock = await this.resolveItem( requiredBlock.requiredItem, requiredBlock.requiredCount );
        //if any item cannot be optained, the whole condition will fail
        if ( gotBlock == false ) {
          return false;
        }
      }

    }
    
    return true;
  }

 
  private async resolveInventory( condition, count ): Promise<boolean> {
    //name is an array means we need multiple items to resolve condition  
    if ( condition.name instanceof Array ) {
      return await this.resolveItemArray( condition.name );
    }

    let currentItemCount = this.actionExecuter.isItemInInventory( condition.name );
    if ( condition.recursive == true && currentItemCount < condition.count ) {
      return await this.resolveItem( condition.name, ( condition.count ? condition.count : 1 ) * count - currentItemCount );
    }
      
    return currentItemCount == 0 ? false : true;
  }


  private async resolveCondition( condition, count ): Promise<boolean> {

    let coordinates;
    let result = false;

    switch ( condition.type ) {

      case 'inInventory':
        return await this.resolveInventory( condition, count );
    
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
          result = true;
        }
        break;

      case 'entityNearby':
        const conditionEntityNearby = new EntityNearby( this.cmds.bot, condition );
        return await conditionEntityNearby.resolve();

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
  async GetItem( itemToFind: string, count = 1 ): Promise<boolean> {
    const item = this.goals.items[ itemToFind ];
    if ( !item ) {
      console.log(`Item ${itemToFind} not specified in goals list`);
      return false;
    }

    for ( const condition of item.conditions ) {

      const result = await this.resolveCondition( condition, count );
      let sumInInventory = this.actionExecuter.isItemInInventory( itemToFind );

      if ( sumInInventory >= count ) {
        return true;
      }

      if ( result ) {
        await wait( 500 );
        await this.resolveActionAfterCondition( condition, itemToFind, count );
      }
      
      sumInInventory = this.actionExecuter.isItemInInventory( itemToFind );

      if ( sumInInventory >= count ) {
        return true;
      }
    }

    return false;
  }


  async GetFuel( amountOfItemsToSmell: number ): Promise<{ item: string; count: number;  }> {
    //TODO: make an interface for this ^
    for ( const key in this.goals.items ) {
      if ( !this.goals.items[ key ].isFuel ) continue;

      const fuelNeeded = Math.ceil( amountOfItemsToSmell / this.goals.items[ key ].smellingItemsAmount );

      const isItemFound = await this.GetItem( key, fuelNeeded );
      if ( isItemFound ) {
        this.cmds.bot.chat('Getting fuel resulted in true');
        return {
          item: key,
          count: fuelNeeded
        };
      }
    }

    throw new Error('Getting fuel resulted in false');
  }

}

exports.GoalInterpreter = GoalInterpreter;