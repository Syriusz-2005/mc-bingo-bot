"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(overwriteDefaultBehaviors = false, { allowedConditions = [], }) {
        this.overwriteDefaultBehaviors = overwriteDefaultBehaviors;
        this.allowedConditions = allowedConditions;
    }
}
exports.Action = Action;
