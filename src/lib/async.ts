
export class async {
  static wait( time : number ) : Promise<void> { return new Promise( ( resolve ) => setTimeout( resolve, time ) )  }
}