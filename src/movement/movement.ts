import { BingoBot } from "../types/bot";

import pathFinder, { Movements } from "mineflayer-pathfinder";
import minecraftData, { IndexedData } from "minecraft-data";
const goals = pathFinder.goals;
const mineflayer = require('mineflayer');

class Movement {
  private goals = goals;
  private bot: BingoBot;
  mcData: IndexedData;
  defaultMove: Movements;
  
  constructor( bot : BingoBot ) {
    this.bot = bot;
    this.mcData = minecraftData( bot.version );
    this.defaultMove = new pathFinder.Movements( bot, this.mcData );
    this.defaultMove.scafoldingBlocks.push( this.mcData.itemsByName['netherrack'].id );
    bot.pathfinder.setMovements( this.defaultMove );
  }

  getGoals() {
    return this.goals;
  }

  async goTo( goal ) {
     return await this.bot.pathfinder.goto( goal );
  }
}

exports.Movement = Movement;