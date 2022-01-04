
export interface ItemParam {
  requiredItem: string;
  requiredCount: number;
}

export type mainParam = string | ItemParam[];

export interface Condition {
  type: string;
  name: mainParam;
  count?: number;
  resultsIn?: number;
  recursive?: boolean;
  actionAfterResolved: string;
}