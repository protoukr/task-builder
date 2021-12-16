import { Task, TaskContext } from './Task';
import { DelayTaskDesk, DoTaskDesk, ForEachTaskDesk, HookTaskDesk, IfTaskDesk, RepeatTaskDesk, WhenTaskDesk, PromiseTaskDesk, WhileTaskDesk, WhenIsTaskCondition } from './tasks';
export interface TaskBuilder<T extends TaskContext> {
    do(func: DoTaskDesk<T>['func']): TaskBuilder<T>;
    wait(promise: PromiseTaskDesk<T>['promise'], skipCallback?: PromiseTaskDesk<T>['skipCallback'], stopCallback?: PromiseTaskDesk<T>['stopCallback']): TaskBuilder<T>;
    delay(time: DelayTaskDesk<T>['time']): TaskBuilder<T>;
    hook(name: HookTaskDesk['name']): TaskBuilder<T>;
    task(task: Task<T>): TaskBuilder<T>;
    parallelQueue(): TaskBuilder<T>;
    queue(): TaskBuilder<T>;
    forEach(collection: ForEachTaskDesk<T>['values'], valueName?: ForEachTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    repeat(numIterations: RepeatTaskDesk<T>['numIterations'], valueName?: RepeatTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    while(condition: WhileTaskDesk<T>['condition'], label?: string): TaskBuilder<T>;
    if(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    else(): TaskBuilder<T>;
    when(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    is(value: WhenIsTaskCondition<T>): TaskBuilder<T>;
    isEqual(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    isNotEqual(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    otherwise(): TaskBuilder<T>;
    end(): TaskBuilder<T>;
    break(label?: string): TaskBuilder<T>;
    continue(label?: string): TaskBuilder<T>;
    build(): Task<T>;
}
