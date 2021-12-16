import { BaseTask } from '../BaseTask';
import { TaskDesk, Task, TaskContext, TaskCallback } from '../Task';
export declare type WhenIsTaskCondition<T> = (value: unknown, ctx: T) => boolean;
export interface WhenTaskDesk<T = TaskContext> {
    type: 'when';
    value: unknown | ((ctx: T) => unknown);
    isTasks: Array<{
        condition: WhenIsTaskCondition<T>;
        task: TaskDesk;
    }>;
    otherwiseTask?: TaskDesk;
}
export declare class WhenTask<T extends TaskContext> extends BaseTask<T> {
    private readonly value;
    private readonly isTasks;
    private readonly otherwiseTask?;
    private task?;
    constructor(value: WhenTaskDesk<T>['value'], isTasks: Array<{
        condition: WhenIsTaskCondition<T>;
        task: Task<T>;
    }>, otherwiseTask?: Task<T> | undefined);
    protected onReset(): void;
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
    private evaluateTask;
}
