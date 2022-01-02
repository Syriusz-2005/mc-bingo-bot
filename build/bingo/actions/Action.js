"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var Action = /** @class */ (function () {
    function Action(overwriteDefaultBehaviors, _a) {
        if (overwriteDefaultBehaviors === void 0) { overwriteDefaultBehaviors = false; }
        var _b = _a.allowedConditions, allowedConditions = _b === void 0 ? [] : _b;
        this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
        this.allowedConditions = allowedConditions;
    }
    return Action;
}());
exports.Action = Action;
