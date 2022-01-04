import { Condition } from "../../types/conditions";


export class Action {
  overwriteDefaultBehaviors: boolean;
  allowedConditions: string[];
  
  constructor( overwriteDefaultBehaviors = false, {
    allowedConditions = [],

  }) {
    this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
    this.allowedConditions = allowedConditions;
  }
}

export interface ActionExecuter {
  doAction( condition: Condition, countNeeded: number ): Promise<boolean>
}