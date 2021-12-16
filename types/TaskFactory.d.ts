import { Hooks } from './Hooks';
import { Task, TaskContext } from './Task';
import { TaskBuilder } from './TaskBuilder';
import { TaskInflater } from './TaskInflater';
import { DelayTaskDesk, DelayTaskSetTimeout, ForEachTaskDesk, IfTaskDesk, PromiseTaskDesk, RepeatTaskDesk, WhenTaskDesk, WhileTaskDesk } from './tasks';
export declare class TaskFactory {
    private readonly inflater;
    private readonly setTimeout?;
    get hooks(): Hooks;
    constructor(inflater?: TaskInflater<TaskContext>, setTimeout?: DelayTaskSetTimeout | undefined);
    parallelQueue<T extends TaskContext = void>(): TaskBuilder<T>;
    while<T extends TaskContext = void>(condition: WhileTaskDesk<T>['condition'], label?: string): TaskBuilder<T>;
    queue<T extends TaskContext = void>(): TaskBuilder<T>;
    when<T extends TaskContext = void>(value: WhenTaskDesk<T>['value']): TaskBuilder<T>;
    if<T extends TaskContext = void>(condition: IfTaskDesk<T>['condition']): TaskBuilder<T>;
    forEach<T extends TaskContext = void>(collection: ForEachTaskDesk<T>['values'], valueName?: ForEachTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    delay<T extends TaskContext = void>(time: DelayTaskDesk<T>['time']): Task<T>;
    do<T extends TaskContext = void>(func: (ctx: T) => void): Task<T>;
    repeat<T extends TaskContext = void>(numIterations: RepeatTaskDesk<T>['numIterations'], valueName?: RepeatTaskDesk<T>['valueName'], label?: string): TaskBuilder<T>;
    wait<T extends TaskContext = void>(promise: PromiseTaskDesk<T>['promise'], onSkipped?: PromiseTaskDesk<T>['skipCallback'], onStopped?: PromiseTaskDesk<T>['stopCallback']): Task<T>;
    private readonly createRootBuilder;
}
