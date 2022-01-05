import { IndexedData } from "minecraft-data";
import { CommandInterpreter } from "../../commands";
import { BingoBot } from "../../types/bot";
import { Condition } from "../../types/conditions";
import { InventoryMethods } from "../inventoryMethods";

export class Goal {
  condition: Condition;
  bot: BingoBot;
  mcData: IndexedData;
  inventoryMethods: InventoryMethods;


  constructor( bot: BingoBot, condition: Condition, mcData: IndexedData, commandInterpreter: CommandInterpreter) {
    this.bot = bot;
    this.condition = condition;
    this.mcData = mcData;
    this.inventoryMethods = new InventoryMethods( mcData, bot, commandInterpreter );
  }

  itemsInInventory( itemName: string ): number {
    const countInInventory = this.bot.inventory.count( this.inventoryMethods.getItemId( itemName ), null );
    return countInInventory ? countInInventory : 0;
  }

}