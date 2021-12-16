"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhenTask = void 0;
const BaseTask_1 = require("../BaseTask");
class WhenTask extends BaseTask_1.BaseTask {
    constructor(value, isTasks, otherwiseTask) {
        super();
        this.value = value;
        this.isTasks = isTasks;
        this.otherwiseTask = otherwiseTask;
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
        const value = (0, BaseTask_1.evaluateValue)(ctx, this.value);
        const foundTask = this.isTasks.find((task) => task.condition(value, ctx));
        if (foundTask != null) {
            return foundTask.task;
        }
        return this.otherwiseTask;
    }
}
exports.WhenTask = WhenTask;
