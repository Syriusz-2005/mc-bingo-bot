

export class NoBlockError extends Error {
  block: string;
  constructor(block: string, message: string = 'Block not found') {
    super(message);
    this.block = block;
  }
}