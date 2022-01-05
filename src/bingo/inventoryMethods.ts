import { IndexedData } from "minecraft-data";
import { Block } from "prismarine-block";
import { Vec3 } from "vec3";
import { CommandInterpreter } from "../commands";
import { BingoBot } from "../types/bot";
import { NoBlockError } from "./errors/noBlockError";
import { NoItemError } from "./errors/noItemError";
import { UnableToPlaceError } from "./errors/unableToPlaceError";


export class InventoryMethods {
  mcData: IndexedData;
  bot: BingoBot;
  cmds: CommandInterpreter
  
  constructor( mcData: IndexedData, bot: BingoBot, cmds: CommandInterpreter) {
    this.mcData = mcData;
    this.bot = bot;
    this.cmds = cmds;
  }

  public getItemId( itemName: string ): number {
    return this.mcData.itemsByName[ itemName ]?.id;
  }

  private isPlacableBlock( block: Block ) : boolean {
    return block.name != 'air' 
    && block.name != 'water'
    && block.name != 'lava'
    && block.name != 'dead_bush'
    && block.boundingBox == 'block'
    && this.bot.blockAt( block.position.offset( 0, 1, 0 ) ).name == 'air' 
    && this.bot.entity.position.distanceTo( block.position ) > 2;
  }

  private async placeBlock( blockName: string ) : Promise<void> {
    const itemInInventory = this.bot.inventory.findInventoryItem( this.getItemId( blockName ), null, false );

    if ( !itemInInventory ) 
      throw new NoItemError( blockName, 'There is no item in inventory' );

    const blockNearby = this.bot.findBlock({
      maxDistance: Number(process.env.BLOCK_PLACING_SEARCH_DISTANCE),
      useExtraInfo: true,
      matching: this.isPlacableBlock
    });

    if (!blockNearby)
      throw new NoBlockError( 'block' );

    this.bot.pathfinder.setGoal( null );
    const wentNearby = await this.cmds.digManager.goNearbyBlock( blockNearby.position.x, blockNearby.position.y, blockNearby.position.z );
    if ( this.bot.inventory.emptySlotCount() == 0 ) {
      //TODO: bot should throw away some items!
    }

    let i = 0;
    while ( true ) {
      i++;
      await this.bot.unequip('hand');
      await this.bot.equip( itemInInventory, 'hand' );
      try {
        await this.bot.placeBlock( blockNearby, new Vec3( 0, 1, 0 ) );
        return
      } catch( err ) { console.warn( err ) }

      if ( i >= 100 ) 
        throw new UnableToPlaceError( itemInInventory.name );
    }
  }

  public async goOntoBlock( blockName: string ): Promise<void> {
    this.placeBlock( blockName );
    const blockPlaced = this.bot.findBlock({
      maxDistance: Number( process.env.BLOCK_PLACING_SEARCH_DISTANCE ),
      useExtraInfo: false,
      matching: block => block.name == blockName
    });
    await this.cmds.digManager.goTo( blockPlaced.position.x, blockPlaced.position.y , blockPlaced.position.z );
  }
}