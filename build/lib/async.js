"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.async = void 0;
var async = /** @class */ (function () {
    function async() {
    }
    async.wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
    return async;
}());
exports.async = async;
