"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelQueue = void 0;
const BaseTask_1 = require("../BaseTask");
const Task_1 = require("../Task");
class ParallelQueue extends BaseTask_1.BaseTask {
    constructor(tasks) {
        super();
        this.tasks = tasks;
        this.numExecutedTasks = 0;
    }
    onReset() {
        super.onReset();
        this.numExecutedTasks = 0;
    }
    onStopped() {
        super.onStopped();
        this.tasks
            .filter(({ status }) => status === Task_1.TaskStatus.EXECUTING)
            .forEach((task) => task.stop());
    }
    onSkipRequested() {
        super.onSkipRequested();
        this.tasks
            .filter(({ status }) => status === Task_1.TaskStatus.EXECUTING)
            .forEach((task) => task.skip());
    }
    onExec(ctx, callback) {
        if (this.tasks.length === 0) {
            callback();
            return;
        }
        const onTaskCompleted = (msg) => {
            this.validateStatusAndCallback(callback);
            if (msg !== undefined) {
                callback(msg);
                return;
            }
            this.numExecutedTasks++;
            if (this.numExecutedTasks === this.tasks.length) {
                callback();
            }
        };
        this.tasks.forEach((task) => {
            task.exec(ctx, onTaskCompleted);
        });
    }
}
exports.ParallelQueue = ParallelQueue;
