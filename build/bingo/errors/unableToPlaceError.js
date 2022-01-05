"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnableToPlaceError = void 0;
class UnableToPlaceError extends Error {
    constructor(block, message = 'Unable to place block') {
        super(message);
        this.block = block;
    }
}
exports.UnableToPlaceError = UnableToPlaceError;
