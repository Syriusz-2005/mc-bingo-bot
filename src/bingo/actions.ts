import { BingoBot } from "../types/bot";
import { GameManager } from "./gameManager";

export class DefaultActions {
  private bot: BingoBot;
  private gameManager: GameManager;

  constructor( bot: BingoBot, gameManager: any ) {
    this.bot = bot;
    this.gameManager = gameManager;
  }

  private async getTools(): Promise<void> {
    const tools = this.gameManager.cmdInterpreter.goalInterpreter.firstItems;
    for ( const tool of tools ) {
      await this.gameManager.Get( tool.name, tool.count );
    }
  }

  async doActionsBeforeCollecting() {
    await this.getTools();
  }
}