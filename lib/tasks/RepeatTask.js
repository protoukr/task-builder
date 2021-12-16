"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatTask = void 0;
const BaseTask_1 = require("../BaseTask");
const LoopLikeTask_1 = require("./LoopLikeTask");
class RepeatTask extends LoopLikeTask_1.LoopLikeTask {
    constructor(task, numIterations, valueName, label) {
        super(label);
        this.task = task;
        this.numIterations = numIterations;
        this.valueName = valueName;
        this.iterationNum = 0;
    }
    onSkipRequested() {
        super.onSkipRequested();
        this.task.skip();
    }
    onStopped() {
        super.onStopped();
        this.task.stop();
    }
    onReset() {
        super.onReset();
        this.iterationNum = 0;
    }
    onExec(ctx, callback) {
        const numIterations = (0, BaseTask_1.evaluateValue)(ctx, this.numIterations);
        const executeTask = () => {
            if (this.iterationNum < numIterations) {
                ctx = (0, BaseTask_1.assignValueToContext)(ctx, this.valueName, this.iterationNum);
                this.iterationNum++;
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
exports.RepeatTask = RepeatTask;
