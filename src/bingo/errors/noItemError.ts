
export class NoItemError extends Error {
  public item: string;

  constructor(item: string, message: string = 'Item does not exist' ) {
    super(message);
    this.item = item;
  }
}