const fs = require('fs/promises');
import { Vec3 } from 'vec3';
const vec = require('vec3');

const wait = ( time ) => new Promise( resolve => setTimeout( resolve, time ) );
import minecraftData, { IndexedData } from "minecraft-data";


import { EntityNearby } from './goal/entityNearby';
import { CommandInterpreter } from "../commands";
import { BingoBot } from "../types/bot";
import { Item } from 'prismarine-item';
import { CraftAction } from './actions/craft';
import { Condition, ItemParam } from '../types/conditions';
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

  async goToItem( x: number, y: number, z: number ): Promise<boolean> {  
    await this.cmds.digManager.goTo( x, y, z );
    return true;
  }
  
  async mineBlock( x: number, y: number, z: number ): Promise<boolean> {
    await this.cmds.digManager.digBlockAt( x, y, z );
    return true;
  }
  
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
  private cmds: CommandInterpreter;
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

    //hack just to delete first coma
    console.log( list.replace( ', ', '' ) );
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


  async resolveActionAfterCondition( condition: Condition, resolvingItem: string, count: number ): Promise<boolean> {

    switch ( condition.actionAfterResolved ) {

      case 'craft':
        const action = new CraftAction( this.actionExecuter.mcData, this.cmds.bot, this.cmds );
        await action.doAction( resolvingItem, condition, count );
        return await this.GetItem( resolvingItem, count );

      case 'smell':

        if ( typeof condition.name == 'string' )
          return await this.actionExecuter.smellItem( condition.name, count );
        
      case 'recheckConditions':
        return await this.GetItem( resolvingItem, count );

      default:
        return true;
    }

  }

  private howManyItemsNeededToCraft( condition: Condition, countWeNeed: number ): { item: string, toCollectCount: number }[] {
    
    const count = ( typeof condition.name === 'string') 
      ? [
          { 
            item: condition.name, 
            toCollectCount: Math.ceil( condition.count * countWeNeed / condition.resultsIn )
          }
        ]
      : condition.name
        .map( craftPart => {
          return { 
            item: craftPart.requiredItem, 
            toCollectCount: Math.ceil( craftPart.requiredCount * countWeNeed / condition.resultsIn )
          }
        });

    return count;
  }

 
  private async resolveInventory( condition: Condition, count: number ): Promise<boolean> {
    
    if ( condition.recursive == true ) {
      const resources = this.howManyItemsNeededToCraft( condition, Number( count ) );
      
      const isSuccess = await Promise.all( 
        resources
          .filter( resource => resource.toCollectCount > 0 )
          .map( async resource => await this.GetItem( resource.item, resource.toCollectCount ) ) 
      );
      
      return isSuccess.every( success => success );
    }
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
          return true;
        }
        break;

      case 'entityNearby':
        const conditionEntityNearby = new EntityNearby( this.cmds.bot, condition, this.actionExecuter.mcData, this.cmds );
        return await conditionEntityNearby.resolve();

      default:
        throw new Error('Invalid condition type');
    }

    return result;
  }

  async GetItem( itemToFind: string, count: number = 1 ): Promise<boolean> {
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