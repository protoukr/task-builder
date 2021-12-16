"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForEachTaskBuilder = exports.IfTaskBuilder = exports.WhileTaskBuilder = exports.WhenTaskBuilder = exports.RepeatTaskBuilder = exports.QueueTaskBuilder = exports.ParallelQueueTaskBuilder = exports.AbstractQueueTaskBuilder = void 0;
const AbstractTaskBuilder_1 = require("./AbstractTaskBuilder");
class AbstractQueueTaskBuilder extends AbstractTaskBuilder_1.AbstractTaskBuilder {
    constructor(pushToParent) {
        super();
        this.pushToParent = pushToParent;
        this.tasksDesc = [];
        this.pushTaskBuilderDesc = (builder) => {
            return this.pushTaskDesk(builder.getDesc());
        };
    }
    do(func) {
        const desc = { type: 'do', func };
        return this.pushTaskDesk(desc);
    }
    wait(promise, onSkipped, onStopped) {
        const desc = {
            type: 'wait',
            promise,
            skipCallback: onSkipped,
        };
        return this.pushTaskDesk(desc);
    }
    delay(time) {
        const desc = { type: 'delay', time };
        return this.pushTaskDesk(desc);
    }
    hook(name) {
        const desc = { type: 'hook', name };
        return this.pushTaskDesk(desc);
    }
    task(task) {
        const desc = { type: 'task', task };
        return this.pushTaskDesk(desc);
    }
    parallelQueue() {
        return new ParallelQueueTaskBuilder(this.pushTaskBuilderDesc);
    }
    queue() {
        return new QueueTaskBuilder(this.pushTaskBuilderDesc);
    }
    forEach(collection, valueName, label) {
        return new ForEachTaskBuilder(this.pushTaskBuilderDesc, collection, valueName, label);
    }
    repeat(numIterations, valueName, label) {
        return new RepeatTaskBuilder(numIterations, valueName, this.pushTaskBuilderDesc, label);
    }
    break(label) {
        const desc = { type: 'break', label };
        return this.pushTaskDesk(desc);
    }
    continue(label) {
        const desc = { type: 'continue', label };
        return this.pushTaskDesk(desc);
    }
    while(condition, label) {
        return new WhileTaskBuilder(condition, this.pushTaskBuilderDesc, label);
    }
    if(condition) {
        return new IfTaskBuilder(condition, this.pushTaskBuilderDesc);
    }
    when(value) {
        return new WhenTaskBuilder(value, this.pushTaskBuilderDesc);
    }
    end() {
        return this.pushToParent(this);
    }
    getLegalOperations() {
        return [
            'end',
            'do',
            'wait',
            'delay',
            'hook',
            'task',
            'parallelQueue',
            'queue',
            'forEach',
            'async',
            'repeat',
            'while',
            'if',
            'when',
            'break',
            'continue',
            'build',
        ];
    }
    build() {
        return this.end().build();
    }
    pushTaskDesk(taskDesk) {
        this.tasksDesc.push(taskDesk);
        return this;
    }
}
exports.AbstractQueueTaskBuilder = AbstractQueueTaskBuilder;
class ParallelQueueTaskBuilder extends AbstractQueueTaskBuilder {
    getDesc() {
        const desc = {
            type: 'parallelQueue',
            tasks: this.tasksDesc,
        };
        return desc;
    }
}
exports.ParallelQueueTaskBuilder = ParallelQueueTaskBuilder;
class QueueTaskBuilder extends AbstractQueueTaskBuilder {
    getDesc() {
        const desc = {
            type: 'queue',
            tasks: this.tasksDesc,
        };
        return desc;
    }
}
exports.QueueTaskBuilder = QueueTaskBuilder;
class RepeatTaskBuilder extends QueueTaskBuilder {
    constructor(numIterations, valueName, pushToParent, label) {
        super(pushToParent);
        this.numIterations = numIterations;
        this.valueName = valueName;
        this.label = label;
    }
    getDesc() {
        const desc = {
            type: 'repeat',
            task: super.getDesc(),
            numIterations: this.numIterations,
            valueName: this.valueName,
            label: this.label,
        };
        return desc;
    }
}
exports.RepeatTaskBuilder = RepeatTaskBuilder;
class WhenIsTaskBuilder extends QueueTaskBuilder {
    is(value) {
        return super.end().is(value);
    }
    otherwise() {
        return super.end().otherwise();
    }
    end() {
        return super.end().end();
    }
    getLegalOperations() {
        return super.getLegalOperations().concat(['otherwise', 'is']);
    }
}
class DefaultTaskBuilder extends QueueTaskBuilder {
    end() {
        return super.end().end();
    }
}
class WhenTaskBuilder extends AbstractTaskBuilder_1.AbstractTaskBuilder {
    constructor(value, parent) {
        super();
        this.value = value;
        this.parent = parent;
        this.isTasks = [];
    }
    is(condition) {
        return new WhenIsTaskBuilder((builder) => {
            this.isTasks.push({ condition, task: builder.getDesc() });
            return this;
        });
    }
    end() {
        return this.parent(this);
    }
    otherwise() {
        return new DefaultTaskBuilder((builder) => {
            this.defaultTask = builder.getDesc();
            return this;
        });
    }
    getLegalOperations() {
        return ['otherwise', 'is', 'end'];
    }
    getDesc() {
        const desc = {
            type: 'when',
            value: this.value,
            isTasks: this.isTasks,
            otherwiseTask: this.defaultTask,
        };
        return desc;
    }
}
exports.WhenTaskBuilder = WhenTaskBuilder;
class WhileTaskBuilder extends QueueTaskBuilder {
    constructor(condition, pushToParent, label) {
        super(pushToParent);
        this.condition = condition;
        this.label = label;
    }
    getDesc() {
        const desc = {
            type: 'while',
            task: super.getDesc(),
            condition: this.condition,
            label: this.label,
        };
        return desc;
    }
}
exports.WhileTaskBuilder = WhileTaskBuilder;
class ElseIfTaskBuilder extends QueueTaskBuilder {
    else() {
        return super.end().else();
    }
    elseif(condition) {
        return super.end().elseif(condition);
    }
    end() {
        return super.end().end();
    }
    getLegalOperations() {
        return super.getLegalOperations().concat(['else', 'elseif']);
    }
}
class ElseTaskBuilder extends QueueTaskBuilder {
    end() {
        return super.end().end();
    }
}
class IfTaskBuilder extends QueueTaskBuilder {
    constructor(condition, parent) {
        super(parent);
        this.condition = condition;
        this.elseIfTasks = [];
    }
    elseif(condition) {
        return new ElseIfTaskBuilder((builder) => {
            this.elseIfTasks.push({ condition, task: builder.getDesc() });
            return this;
        });
    }
    else() {
        return new ElseTaskBuilder((builder) => {
            this.elseTask = builder.getDesc();
            return this;
        });
    }
    getLegalOperations() {
        return super.getLegalOperations().concat(['else', 'elseif']);
    }
    getDesc() {
        const desc = {
            type: 'if',
            condition: this.condition,
            ifTask: super.getDesc(),
            elseIfTasks: this.elseIfTasks,
            elseTask: this.elseTask,
        };
        return desc;
    }
}
exports.IfTaskBuilder = IfTaskBuilder;
class ForEachTaskBuilder extends QueueTaskBuilder {
    constructor(parent, collection, valueName, label) {
        super(parent);
        this.collection = collection;
        this.valueName = valueName;
        this.label = label;
    }
    getDesc() {
        const desc = {
            type: 'forEach',
            task: super.getDesc(),
            values: this.collection,
            valueName: this.valueName,
            label: this.label,
        };
        return desc;
    }
}
exports.ForEachTaskBuilder = ForEachTaskBuilder;
