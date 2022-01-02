"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.math = void 0;
var math = /** @class */ (function () {
    function math() {
    }
    math.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    return math;
}());
exports.math = math;
