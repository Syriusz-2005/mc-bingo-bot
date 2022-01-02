import { BingoBot } from "../../types/bot";
import { Condition } from "../../types/conditions";

export class Goal {
  condition: Condition;
  bot: BingoBot;
  mcData: any;


  constructor( bot: BingoBot, condition: Condition ) {
    this.bot = bot;
    this.condition = condition;
  }


  private getItemId( itemName: string ): number {
    return this.mcData.itemsByName[ itemName ].id;
  }


  itemsInInventory( itemName: string ): number {
    const countInInventory = this.bot.inventory.count( this.getItemId( itemName ), null );
    return countInInventory ? countInInventory : 0;
  }

}