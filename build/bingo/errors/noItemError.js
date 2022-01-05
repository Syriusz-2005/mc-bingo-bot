"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoItemError = void 0;
class NoItemError extends Error {
    constructor(item, message = 'Item does not exist') {
        super(message);
        this.item = item;
    }
}
exports.NoItemError = NoItemError;
