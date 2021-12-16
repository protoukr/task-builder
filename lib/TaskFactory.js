"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
const builders_1 = require("./builders");
const Hooks_1 = require("./Hooks");
const TaskInflater_1 = require("./TaskInflater");
const tasks_1 = require("./tasks");
class TaskFactory {
    constructor(inflater = new TaskInflater_1.TaskInflater(new Hooks_1.Hooks()), setTimeout) {
        this.inflater = inflater;
        this.setTimeout = setTimeout;
        this.createRootBuilder = (builder) => {
            return new builders_1.RootTaskBuilder(this.inflater, builder);
        };
    }
    get hooks() {
        return this.inflater.hooks;
    }
    parallelQueue() {
        return new builders_1.ParallelQueueTaskBuilder(this.createRootBuilder);
    }
    while(condition, label) {
        return new builders_1.WhileTaskBuilder(condition, this.createRootBuilder, label);
    }
    queue() {
        return new builders_1.QueueTaskBuilder(this.createRootBuilder);
    }
    when(value) {
        return new builders_1.WhenTaskBuilder(value, this.createRootBuilder);
    }
    if(condition) {
        return new builders_1.IfTaskBuilder(condition, this.createRootBuilder);
    }
    forEach(collection, valueName, label) {
        return new builders_1.ForEachTaskBuilder(this.createRootBuilder, collection, valueName, label);
    }
    delay(time) {
        return new tasks_1.DelayTask(time, this.setTimeout);
    }
    do(func) {
        return new tasks_1.DoTask(func);
    }
    repeat(numIterations, valueName, label) {
        return new builders_1.RepeatTaskBuilder(numIterations, valueName, this.createRootBuilder, label);
    }
    wait(promise, onSkipped, onStopped) {
        return new tasks_1.PromiseTask(promise, onSkipped, onStopped);
    }
}
exports.TaskFactory = TaskFactory;
