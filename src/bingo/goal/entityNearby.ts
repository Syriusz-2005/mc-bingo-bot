import { Goal } from './Goal.js';
import mineflayer from 'mineflayer';
import { Condition } from '../../types/conditions';
import { Resolvable } from './resolvable';
import { BingoBot } from '../../types/bot.js';

export class EntityNearby extends Goal implements Resolvable {
  mobType: string | any[];

  constructor( bot: BingoBot, condition: Condition ) {
    super( bot, condition );

    if ( condition.type != 'entityNearby' )
      throw new Error( 'condition type must be entityNearby' );

    this.mobType = condition.name;
  }

  private killEntity( entity ) : Promise<void> {
    return new Promise( (resolve, reject) => {
      this.bot.pvp.attack( entity );

      this.bot.once('stoppedAttacking', () => {
        resolve();
      });
    });
  }

 
  private getEntityNearby() {
    const entity = this.bot.nearestEntity( entity => entity.type == 'mob' && entity.name == this.mobType );

    if ( !entity )
      throw new Error( 'Entity not found');

    return entity;
  }


  async resolve(): Promise<boolean> {
    try {
      const entityToKill = this.getEntityNearby();
      
      await this.killEntity( entityToKill );
      return true;
    } catch(err) {
      console.log( err );
      return false;
    }
  }
}