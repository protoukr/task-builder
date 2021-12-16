"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakTask = exports.Break = void 0;
const BaseTask_1 = require("../BaseTask");
class Break {
    constructor(label) {
        this.label = label;
    }
}
exports.Break = Break;
class BreakTask extends BaseTask_1.BaseTask {
    constructor(label) {
        super();
        this.label = label;
    }
    onExec(ctx, callback) {
        callback(new Break(this.label));
    }
}
exports.BreakTask = BreakTask;
