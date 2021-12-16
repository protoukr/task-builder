import { BaseTask } from '../BaseTask';
import { TaskCallback, Task, TaskContext, TaskDesk } from '../Task';
export interface ParallelQueueDesk {
    type: 'parallelQueue';
    tasks: TaskDesk[];
}
export declare class ParallelQueue<T extends TaskContext> extends BaseTask<T> {
    private readonly tasks;
    private numExecutedTasks;
    constructor(tasks: Array<Task<T>>);
    protected onReset(): void;
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
