"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const BaseTask_1 = require("../BaseTask");
class Queue extends BaseTask_1.BaseTask {
    constructor(tasks) {
        super();
        this.tasks = tasks;
        this.taskNum = 0;
    }
    onSkipRequested() {
        var _a;
        super.onSkipRequested();
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.skip();
    }
    onReset() {
        super.onReset();
        this.taskNum = 0;
        this.task = undefined;
    }
    onStopped() {
        var _a;
        super.onStopped();
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.stop();
    }
    onExec(ctx, callback) {
        const executeTask = () => {
            if (this.taskNum < this.tasks.length) {
                this.task = this.tasks[this.taskNum++];
                this.task.exec(ctx, onTaskExecuted);
            }
            else {
                callback();
            }
        };
        const onTaskExecuted = (msg) => {
            this.validateStatusAndCallback(callback);
            if (msg === undefined) {
                executeTask();
            }
            else {
                callback(msg);
            }
        };
        executeTask();
    }
}
exports.Queue = Queue;
