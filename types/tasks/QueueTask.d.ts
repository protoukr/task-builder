import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { BaseTask } from '../BaseTask';
export interface QueueDesk {
    type: 'queue';
    tasks: TaskDesk[];
}
export declare class Queue<T extends TaskContext> extends BaseTask<T> {
    private readonly tasks;
    private taskNum;
    private task?;
    constructor(tasks: Array<Task<T>>);
    protected onSkipRequested(): void;
    protected onReset(): void;
    protected onStopped(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
