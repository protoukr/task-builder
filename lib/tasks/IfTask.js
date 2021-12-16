"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfTask = void 0;
const BaseTask_1 = require("../BaseTask");
class IfTask extends BaseTask_1.BaseTask {
    constructor(condition, ifTask, elseIfTasks, elseTask) {
        super();
        this.condition = condition;
        this.ifTask = ifTask;
        this.elseIfTasks = elseIfTasks;
        this.elseTask = elseTask;
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
    onSkipRequested() {
        var _a;
        super.onSkipRequested();
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.skip();
    }
    onExec(ctx, callback) {
        this.task = this.evaluateTask(ctx);
        if (this.task != null) {
            this.task.exec(ctx, (msg) => {
                this.validateStatusAndCallback(callback);
                callback(msg);
            });
        }
        else {
            callback();
        }
    }
    evaluateTask(ctx) {
        var _a;
        if (this.condition(ctx)) {
            return this.ifTask;
        }
        const foundTask = (_a = this.elseIfTasks) === null || _a === void 0 ? void 0 : _a.find(({ condition }) => condition(ctx));
        if (foundTask != null) {
            return foundTask.task;
        }
        return this.elseTask;
    }
}
exports.IfTask = IfTask;
