"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskInflater = void 0;
const Hooks_1 = require("./Hooks");
const tasks_1 = require("./tasks");
class TaskInflater {
    constructor(hooks = new Hooks_1.Hooks(), setTimeout) {
        this.hooks = hooks;
        this.setTimeout = setTimeout;
    }
    inflate(desc) {
        const customTask = this.inflateCustomTask(desc);
        if (customTask != null) {
            return customTask;
        }
        switch (desc.type) {
            case 'queue':
                return this.inflateQueueTask(desc);
            case 'parallelQueue':
                return this.inflateParallelQueueTask(desc);
            case 'while':
                return this.inflateWhileTask(desc);
            case 'if':
                return this.inflateIfTask(desc);
            case 'when':
                return this.inflateWhenTask(desc);
            case 'delay':
                return this.inflateDelayTask(desc);
            case 'do':
                return this.inflateDoTask(desc);
            case 'wait':
                return this.inflatePromiseTask(desc);
            case 'hook':
                return this.inflateHookTask(desc);
            case 'task':
                return this.inflateTask(desc);
            case 'forEach':
                return this.inflateForEachTask(desc);
            case 'repeat':
                return this.inflateRepeatTask(desc);
            case 'break':
                return this.inflateBreakTask(desc);
            case 'continue':
                return this.inflateContinueTask(desc);
            default:
                throw new Error(`Unknown task type: ${desc.type}`);
        }
    }
    inflateCustomTask(desc) {
        return null;
    }
    inflateQueueTask({ tasks }) {
        return new tasks_1.Queue(this.inflateTasks(tasks));
    }
    inflateParallelQueueTask({ tasks }) {
        return new tasks_1.ParallelQueue(this.inflateTasks(tasks));
    }
    inflateWhileTask({ condition, task, label, }) {
        return new tasks_1.WhileTask(this.inflate(task), condition, label);
    }
    inflateIfTask(desk) {
        return new tasks_1.IfTask(desk.condition, this.inflate(desk.ifTask), desk.elseIfTasks.map(({ condition, task }) => ({
            condition,
            task: this.inflate(task),
        })), desk.elseTask != null ? this.inflate(desk.elseTask) : undefined);
    }
    inflateWhenTask(desk) {
        return new tasks_1.WhenTask(desk.value, desk.isTasks.map(({ condition, task }) => ({
            condition,
            task: this.inflate(task),
        })), desk.otherwiseTask != null ? this.inflate(desk.otherwiseTask) : undefined);
    }
    inflateDelayTask({ time }) {
        return new tasks_1.DelayTask(time, this.setTimeout);
    }
    inflateBreakTask({ label }) {
        return new tasks_1.BreakTask(label);
    }
    inflateContinueTask({ label }) {
        return new tasks_1.ContinueTask(label);
    }
    inflateDoTask({ func }) {
        return new tasks_1.DoTask(func);
    }
    inflatePromiseTask(desc) {
        return new tasks_1.PromiseTask(desc.promise, desc.skipCallback, desc.stopCallback);
    }
    inflateRepeatTask({ task, numIterations, valueName, label, }) {
        return new tasks_1.RepeatTask(this.inflate(task), numIterations, valueName, label);
    }
    inflateForEachTask({ values, valueName, task, label, }) {
        return new tasks_1.ForEachTask(this.inflate(task), values, valueName, label);
    }
    inflateTask({ task }) {
        return task;
    }
    inflateHookTask({ name }) {
        return new tasks_1.HookTask(name, this.hooks);
    }
    inflateTasks(tasks) {
        return tasks.map((desk) => this.inflate(desk));
    }
}
exports.TaskInflater = TaskInflater;
