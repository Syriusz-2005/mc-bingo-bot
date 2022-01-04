import { IndexedData } from "minecraft-data";


export class InventoryMethods {
  mcData: IndexedData;
  
  constructor( mcData: IndexedData ) {
    this.mcData = mcData;
  }

  public getItemId( itemName: string ): number {
    return this.mcData.itemsByName[ itemName ].id;
  }

}