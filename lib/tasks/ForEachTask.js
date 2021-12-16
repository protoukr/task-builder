"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForEachTask = void 0;
const BaseTask_1 = require("../BaseTask");
const LoopLikeTask_1 = require("./LoopLikeTask");
class ForEachTask extends LoopLikeTask_1.LoopLikeTask {
    constructor(task, values, valueName, label) {
        super(label);
        this.task = task;
        this.values = values;
        this.valueName = valueName;
    }
    onStopped() {
        super.onStopped();
        this.task.stop();
    }
    onSkipRequested() {
        super.onSkipRequested();
        this.task.skip();
    }
    onExec(ctx, callback) {
        const values = (0, BaseTask_1.evaluateValue)(ctx, this.values);
        const iterator = values[Symbol.iterator]();
        const executeTask = () => {
            const { value, done } = iterator.next();
            if (done === true) {
                callback();
            }
            else {
                ctx = (0, BaseTask_1.assignValueToContext)(ctx, this.valueName, value);
                this.task.exec(ctx, onTaskExecuted);
            }
        };
        const onTaskExecuted = (msg) => {
            this.validateStatusAndCallback(callback);
            if (!this.handleTaskMsg(callback, msg)) {
                executeTask();
            }
        };
        executeTask();
    }
}
exports.ForEachTask = ForEachTask;
