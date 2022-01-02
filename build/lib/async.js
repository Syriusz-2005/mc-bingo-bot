"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = void 0;
class async {
    static wait(time) { return new Promise((resolve) => setTimeout(resolve, time)); }
}
exports.async = async;
