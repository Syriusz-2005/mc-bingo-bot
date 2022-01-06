import { IndexedData } from "minecraft-data";
import { Recipe, RecipeConstructor } from "prismarine-recipe";
import { CommandInterpreter } from "../../commands";
import { BingoBot } from "../../types/bot";
import { Condition, ItemParam, mainParam } from "../../types/conditions";
import { Action, Executable } from "./Action";


export class CraftAction extends Action implements Executable {
  constructor( mcData: IndexedData, bot: BingoBot, cmds: CommandInterpreter ) {
    super( false, {
      allowedConditions: [ "in_inventory" ],
      mcData,
      bot,
      cmds
    });
  }

  private async craftInInventory( recipe: Recipe, timesCrafted: number ) : Promise<boolean> {
    try {
      await this.bot.craft( recipe, timesCrafted, null );
      return true;
    } catch( err ) {
      return false;
    }
  }

  private async craftItem( itemName: string, timesCrafted: number = 1 ) : Promise<boolean> {
    const recipies = this.bot.recipesFor( this.inventoryMethods.getItemId( itemName ), null, 0, true );

    for ( let i = 0; i < recipies.length; i++ ) {
      const recipe = recipies[ i ];

      if ( !recipe ) 
        continue;
      
      if ( !recipe.requiresTable ) {
        this.craftInInventory( recipe, timesCrafted );
        continue;
      }

      //recipe requires crafting table!
      const crafting = await this.inventoryMethods.goOntoBlock( 'crafting_table' );
      try {
        await this.bot.craft( recipe, timesCrafted, crafting );
        return true;
      } catch( err ) {}
    }
    
    return false;
  }

  async doAction( neededItem: string, condition: Condition, countNeeded: number ) : Promise<boolean> {
    const currentItemCount: number = this.getNeededItemCount( neededItem );
    
    //handling deprecated way of writing crafting data where condition.name is a string not an Array
    const craftingData : ItemParam[]  = 
      condition.name instanceof Array
      ? condition.name 
      : [{ requiredItem: condition.name, requiredCount: condition.count }];

    const isReadyToCraft = craftingData
      .map( param => {
        const count = this.getNeededItemCount( param.requiredItem );
        console.log( count >= param.requiredCount );
        return count >= param.requiredCount;
      })
      .every( param => param == true );
    
    if ( !isReadyToCraft )
      return false;
    
    return await this.craftItem( neededItem, Math.ceil( ( countNeeded - currentItemCount ) / condition.resultsIn ) );
  }
}