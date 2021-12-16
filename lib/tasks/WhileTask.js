"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhileTask = void 0;
const LoopLikeTask_1 = require("./LoopLikeTask");
class WhileTask extends LoopLikeTask_1.LoopLikeTask {
    constructor(task, condition, label) {
        super(label);
        this.task = task;
        this.condition = condition;
    }
    onSkipRequested() {
        super.onSkipRequested();
        this.task.skip();
    }
    onStopped() {
        super.onStopped();
        this.task.stop();
    }
    onExec(ctx, callback) {
        const executeTask = () => {
            if (this.condition(ctx)) {
                this.task.exec(ctx, onTaskExecuted);
            }
            else {
                callback();
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
exports.WhileTask = WhileTask;
