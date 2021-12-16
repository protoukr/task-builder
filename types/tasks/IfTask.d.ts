import { BaseTask } from '../BaseTask';
import { Task, TaskContext, TaskDesk, TaskCallback } from '../Task';
export interface IfTaskDesk<T = TaskContext> {
    type: 'if';
    condition(ctx: T): boolean;
    ifTask: TaskDesk;
    elseIfTasks: Array<{
        condition(ctx: T): unknown;
        task: TaskDesk;
    }>;
    elseTask?: TaskDesk;
}
export declare class IfTask<T extends TaskContext> extends BaseTask<T> {
    private readonly condition;
    private readonly ifTask;
    private readonly elseIfTasks?;
    private readonly elseTask?;
    private task?;
    constructor(condition: IfTaskDesk<T>['condition'], ifTask: Task<T>, elseIfTasks?: {
        condition(ctx: T): unknown;
        task: Task<T>;
    }[] | undefined, elseTask?: Task<T> | undefined);
    protected onReset(): void;
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
    private evaluateTask;
}
