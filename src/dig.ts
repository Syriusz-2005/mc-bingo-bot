import mineflayer from "mineflayer";
import { BingoBot } from "./types/bot";
const vec = require( "vec3" );
const { Movement } = require( "./movement/movement.js" );

export class DigManager {
  private bot: BingoBot;
  private movement: any;

  constructor( bot ) {
    this.bot = bot;
    this.movement = new Movement( bot );
  }

  removeGoals() {
    this.movement.goTo( null ).catch( err => {});
  }

  goTo( x, y, z ) {
    return new Promise( ( resolve ) => {
      const goal = new (this.movement.getGoals().GoalBlock )( x, y, z, this.bot )
      this.movement.goTo( goal )
        .then( resolve )
        .catch( resolve );
    });
  }

  goNearby( x, z ) {
    return new Promise( ( resolve ) => {
      const goal = new (this.movement.getGoals().GoalNearXZ )( x, z, 4 )
      this.movement.goTo( goal )
        .then( resolve )
        .catch( resolve );
    });
  }

  async goNearbyBlock( x: number, y: number, z: number ) {
    const block = this.bot.blockAt( new vec( x, y, z ) );
    if ( this.bot.canDigBlock( block ) ) {
      return true;
    }

    const goal = new (this.movement.getGoals().GoalPlaceBlock)( new vec( x, y, z ), this.bot.world, {
      range: 3,
    });
    try {
      await this.movement.goTo( goal );
      return true;
    } catch(err) {
      return false
    }
  }


  digBlockAt( x: number, y: number, z: number) : Promise<void|boolean> {
    return new Promise( (resolve, reject) => {
      const that = this;

      function onPathUpdate( r ) {
        if ( r.status == 'noPath' ) {
          that.bot.off('path_update', onPathUpdate );
          resolve();
        }
      }

      try {
        const blockToDig = this.bot.blockAt( new vec( x, y, z ) );
        if ( this.bot.canDigBlock( blockToDig ) ) {
          this.tryDigBlockAt( x, y, z )
            .then( resolve )
            .catch( resolve );
          return;
        }
      
        this.bot.on('path_update', onPathUpdate );

        const goal = new (this.movement.getGoals().GoalBreakBlock)( x, y, z, this.bot );
        this.movement.goTo( goal )
          .then( async () => {
            this.bot.off('path_update', onPathUpdate );
            await this.tryDigBlockAt( x, y, z );
            resolve();
          })
          .catch( async err => {
            console.log( err );
            this.bot.off('path_update', onPathUpdate );
            await this.tryDigBlockAt( x, y, z );
            resolve();
          });

        
      } catch( err ) {
        this.bot.off('path_update', onPathUpdate );
        resolve();
      }
    });
  }

  private async tryDigBlockAt( x : number, y : number, z : number ) : Promise<boolean> {
    try {
      this.bot.chat(`Digging block: ${x}, ${y}, ${z}`);
      const blockToDig = this.bot.blockAt( new vec( x, y, z ) );
      this.bot.tool.equipForBlock( blockToDig, {});
      await this.bot.dig( blockToDig );
      return true;
    } catch( err ) {
      return true;
    }
  }
}