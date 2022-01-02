import { Bot } from "mineflayer";
import { type as webInventoryType } from "mineflayer-web-inventory";

export interface BingoBot extends Bot {
  webInventory: webInventoryType;
  tool: any;
  pvp: any;
  on: ( a: string, cb: Function ) => this;
  off: ( a: string, cb: Function ) => this;
  once: ( a: string, cb: Function ) => this;
}