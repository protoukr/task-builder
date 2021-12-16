import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskBuilder } from '../TaskBuilder';
import { DelayTaskDesk, DoTaskDesk, ForEachTaskDesk, HookTaskDesk, IfTaskDesk, PromiseTaskDesk, RepeatTaskDesk, WhenIsTaskCondition, WhenTaskDesk, WhileTaskDesk } from '../tasks';
import { AbstractTaskBuilder } from './AbstractTaskBuilder';
export declare type PushTaskBuilderDescToParent<T extends TaskContext> = (desc: AbstractTaskBuilder<T>) => AbstractTaskBuilder<T>;
export declare abstract class AbstractQueueTaskBuilder<T extends TaskContext> extends AbstractTaskBuilder<T> {
    private readonly pushToParent;
    protected readonly tasksDesc: TaskDesk[];
    constructor(pushToParent: PushTaskBuilderDescToParent<T>);
    do(func: DoTaskDesk<T>['func']): TaskBuilder<T>;
    wait(promise: PromiseTaskDesk<T>['promise'], onSkipped?: PromiseTaskDesk<T>['skipCallback'], onStopped?: PromiseTaskDesk<T>['stopCallback']): TaskBuilder<T>;
    delay(time: DelayTaskDesk<T>['time']): TaskBuilder<T>;
    hook(name: HookTaskDesk['name']): TaskBuilder<T>;
    task(task: Task<T>): TaskBuilder<T>;
    parallelQueue(): TaskBuilder<T>;
    queue(): TaskBuilder<T>;
    forEach(collection: ForEachTaskDesk<T>['values'], valueName: ForEachTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    repeat(numIterations: RepeatTaskDesk<T>['numIterations'], valueName: RepeatTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    break(label?: string): TaskBuilder<T>;
    continue(label?: string): TaskBuilder<T>;
    while(condition: WhileTaskDesk<T>['condition'], label?: string): TaskBuilder<T>;
    if(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    when(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    end(): TaskBuilder<T>;
    getLegalOperations(): string[];
    build(): Task<T>;
    protected pushTaskDesk(taskDesk: TaskDesk): AbstractTaskBuilder<T>;
    private readonly pushTaskBuilderDesc;
}
export declare class ParallelQueueTaskBuilder<T extends TaskContext> extends AbstractQueueTaskBuilder<T> {
    getDesc(): TaskDesk;
}
export declare class QueueTaskBuilder<T extends TaskContext> extends AbstractQueueTaskBuilder<T> {
    getDesc(): TaskDesk;
}
export declare class RepeatTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
    private readonly numIterations;
    private readonly valueName;
    private readonly label?;
    constructor(numIterations: RepeatTaskDesk<T>['numIterations'], valueName: RepeatTaskDesk<T>['valueName'], pushToParent: PushTaskBuilderDescToParent<T>, label?: string | undefined);
    getDesc(): TaskDesk;
}
export declare class WhenTaskBuilder<T extends TaskContext> extends AbstractTaskBuilder<T> {
    private readonly value;
    private readonly parent;
    private readonly isTasks;
    private defaultTask?;
    constructor(value: WhenTaskDesk<T>['value'], parent: PushTaskBuilderDescToParent<T>);
    is(condition: WhenIsTaskCondition<T>): TaskBuilder<T>;
    end(): TaskBuilder<T>;
    otherwise(): TaskBuilder<T>;
    getLegalOperations(): string[];
    getDesc(): TaskDesk;
}
export declare class WhileTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
    private readonly condition;
    private readonly label?;
    constructor(condition: WhileTaskDesk<T>['condition'], pushToParent: PushTaskBuilderDescToParent<T>, label?: string | undefined);
    getDesc(): TaskDesk;
}
export declare class IfTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
    private readonly condition;
    private readonly elseIfTasks;
    private elseTask?;
    constructor(condition: IfTaskDesk<T>['condition'], parent: PushTaskBuilderDescToParent<T>);
    elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    else(): TaskBuilder<T>;
    getLegalOperations(): string[];
    getDesc(): TaskDesk;
}
export declare class ForEachTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
    private readonly collection;
    private readonly valueName;
    private readonly label?;
    constructor(parent: PushTaskBuilderDescToParent<T>, collection: ForEachTaskDesk<T>['values'], valueName: ForEachTaskDesk<T>['valueName'], label?: string | undefined);
    getDesc(): TaskDesk;
}
