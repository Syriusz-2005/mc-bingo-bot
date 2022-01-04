import { Condition } from "../../types/conditions";

export interface Resolvable {
  condition: Condition;
  resolve() : Promise<boolean>
}