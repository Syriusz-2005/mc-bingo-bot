"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoBlockError = void 0;
class NoBlockError extends Error {
    constructor(block, message = 'Block not found') {
        super(message);
        this.block = block;
    }
}
exports.NoBlockError = NoBlockError;
