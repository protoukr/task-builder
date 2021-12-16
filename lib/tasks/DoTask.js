"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoTask = void 0;
const BaseTask_1 = require("../BaseTask");
class DoTask extends BaseTask_1.BaseTask {
    constructor(func) {
        super();
        this.func = func;
    }
    onExec(ctx, callback) {
        try {
            this.func(ctx);
            callback();
        }
        catch (error) {
            callback(error);
        }
    }
}
exports.DoTask = DoTask;
