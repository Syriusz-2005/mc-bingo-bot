import { IndexedData } from "minecraft-data";
import { BingoBot } from "../types/bot";
import { NoItemError } from "./errors/noItemError";


export class InventoryMethods {
  mcData: IndexedData;
  bot: BingoBot;
  
  constructor( mcData: IndexedData, bot: BingoBot ) {
    this.mcData = mcData;
    this.bot = bot;
  }

  public getItemId( itemName: string ): number {
    return this.mcData.itemsByName[ itemName ]?.id;
  }

  private async placeBlock( blockName: string ) : Promise<void> {
    const itemsInInventory = this.bot.inventory.findInventoryItem( this.getItemId( blockName ), null, false );

    if ( !itemsInInventory ) 
      throw new NoItemError( blockName, 'There is no item in inventory' );

    
  }

  public goOntoBlock( blockName: string ): void {
    
  }
}