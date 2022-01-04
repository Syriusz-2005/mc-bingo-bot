import { BingoBot } from "../../types/bot";
import { Condition } from "../../types/conditions";
import { InventoryMethods } from "../inventoryMethods";


export class Action {
  overwriteDefaultBehaviors: boolean;
  allowedConditions: string[];
  inventoryMethods: InventoryMethods;
  bot: BingoBot
  
  constructor( overwriteDefaultBehaviors = false, {
    allowedConditions = [],
    mcData,
    bot
  }) {
    this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
    this.allowedConditions = allowedConditions;
    this.inventoryMethods = new InventoryMethods( mcData );
    this.bot = bot;
  }

  public getNeededItemCount( itemName: string): number {
   return this.bot.inventory.count( this.inventoryMethods.getItemId( itemName ), null );
  }

}

export interface Executable {
  doAction( neededItem: string, condition: Condition, countNeeded: number ): Promise<boolean>
}