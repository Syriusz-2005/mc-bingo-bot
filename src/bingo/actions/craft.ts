import { IndexedData } from "minecraft-data";
import { Condition, ItemParam, mainParam } from "../../types/conditions";
import { Action, Executable } from "./Action";


export class CraftAction extends Action implements Executable {
  constructor( mcData: IndexedData, bot ) {
    super( false, {
      allowedConditions: [ "in_inventory" ],
      mcData,
      bot
    });
  }

  private async craftItem( itemName: string ) : Promise<boolean> {


    return true;
  }

  async doAction( neededItem: string, condition: Condition, countNeeded: number ) : Promise<boolean> {
    const neededItemCount: number = this.getNeededItemCount( neededItem );

    //handling deprecated way of writing crafting data where condition.name is a string not an Array
    const craftingData : ItemParam[]  = 
      condition.name instanceof Array 
      ? condition.name 
      : [{ requiredItem: condition.name, requiredCount: condition.count }]

    const isReadyToCraft = craftingData
      .map( param => {
        const count = this.getNeededItemCount( param.requiredItem );

        return count >= param.requiredCount;
      })
      .some( param => !param );

    if ( !isReadyToCraft )
      return false;
    
     

    return true;
  }
}