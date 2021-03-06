import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskBuilder } from '../TaskBuilder';
import { DelayTaskDesk, DoTaskDesk, ForEachTaskDesk, HookTaskDesk, IfTaskDesk, PromiseTaskDesk, RepeatTaskDesk, WhenIsTaskCondition, WhenTaskDesk, WhileTaskDesk } from '../tasks';
export declare abstract class AbstractTaskBuilder<T extends TaskContext> implements TaskBuilder<T> {
    build(): Task<T>;
    do(func: DoTaskDesk<T>['func']): TaskBuilder<T>;
    wait(promise: PromiseTaskDesk<T>['promise'], skipCallback?: PromiseTaskDesk<T>['skipCallback'], stopCallback?: PromiseTaskDesk<T>['stopCallback']): TaskBuilder<T>;
    break(label?: string): TaskBuilder<T>;
    continue(label?: string): TaskBuilder<T>;
    delay(time: DelayTaskDesk<T>['time']): TaskBuilder<T>;
    hook(name: HookTaskDesk['name']): TaskBuilder<T>;
    task(task: Task<T>): TaskBuilder<T>;
    parallelQueue(): TaskBuilder<T>;
    queue(): TaskBuilder<T>;
    forEach(collection: ForEachTaskDesk<T>['values'], valueName: ForEachTaskDesk<T>['valueName']): TaskBuilder<T>;
    repeat(numIterations: RepeatTaskDesk<T>['numIterations'], valueName: RepeatTaskDesk<T>['valueName']): TaskBuilder<T>;
    while(condition: WhileTaskDesk<T>['condition']): TaskBuilder<T>;
    if(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    else(): TaskBuilder<T>;
    when(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    is(value: WhenIsTaskCondition<T>): TaskBuilder<T>;
    isEqual(value: unknown | ((ctx: T) => unknown)): TaskBuilder<T>;
    isNotEqual(value: unknown | ((ctx: T) => unknown)): TaskBuilder<T>;
    otherwise(): TaskBuilder<T>;
    end(): TaskBuilder<T>;
    protected createIllegalOperationError(operation: string): Error;
    abstract getDesc(): TaskDesk;
    getLegalOperations(): string[];
}
