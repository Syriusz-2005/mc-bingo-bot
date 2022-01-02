"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.math = void 0;
class math {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
exports.math = math;
