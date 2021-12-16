import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';
export interface ForEachTaskDesk<T = TaskContext> {
    type: 'forEach';
    values: Iterable<unknown> | ((ctx: T) => Iterable<unknown>);
    task: TaskDesk;
    label?: string;
    valueName?: keyof T;
}
export declare class ForEachTask<T extends TaskContext> extends LoopLikeTask<T> {
    private readonly task;
    private readonly values;
    private readonly valueName;
    constructor(task: Task<T>, values: ForEachTaskDesk<T>['values'], valueName: ForEachTaskDesk<T>['valueName'], label?: string);
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
