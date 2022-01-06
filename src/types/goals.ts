import { Condition } from "./conditions";

export interface ItemCount {
  name: string;
  count: number;
}

export type ItemsBotWillOptain = ItemCount[];

export interface ItemData {
  madeBy?: string;
  isFuel?: boolean;
  smellingItemsAmount?: number;
  conditions: Condition[]
}

export interface GoalsData {
  readonly config: { 
    itemsBotNeeds: ItemsBotWillOptain 
  };
  readonly items: {
    [ itemName: string ]: ItemData
  }
}