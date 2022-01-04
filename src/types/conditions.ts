
export interface ConditionParam {
  requiredItem: string;
  requiredCount: number;
}

export interface Condition {
  type: string;
  name: string | ConditionParam[];
  resultsIn?: number;
  recursive?: boolean;
  actionAfterResolved: string;
}