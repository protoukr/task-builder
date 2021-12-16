"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookTask = void 0;
const BaseTask_1 = require("../BaseTask");
const ParallelQueueTask_1 = require("./ParallelQueueTask");
class HookTask extends BaseTask_1.BaseTask {
    constructor(hookName, hooks) {
        super();
        this.hookName = hookName;
        this.hooks = hooks;
    }
    onReset() {
        super.onReset();
        this.task = undefined;
    }
    onStopped() {
        var _a;
        super.onStopped();
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.stop();
    }
    onExec(ctx, callback) {
        const tasks = this.hooks.hookTasks(this.hookName);
        if (tasks.length > 0) {
            this.task = new ParallelQueueTask_1.ParallelQueue(tasks);
            this.task.exec(ctx, callback);
        }
        else {
            callback();
        }
    }
}
exports.HookTask = HookTask;
