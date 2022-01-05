

export class UnableToPlaceError extends Error {
  block: string;
  constructor( block: string, message: string = 'Unable to place block') {
    super(message);
    this.block = block;
  }
}