"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinueTask = exports.Continue = void 0;
const BaseTask_1 = require("../BaseTask");
class Continue {
    constructor(label) {
        this.label = label;
    }
}
exports.Continue = Continue;
class ContinueTask extends BaseTask_1.BaseTask {
    constructor(label) {
        super();
        this.label = label;
    }
    onExec(ctx, callback) {
        callback(new Continue(this.label));
    }
}
exports.ContinueTask = ContinueTask;
