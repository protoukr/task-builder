import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';
export interface RepeatTaskDesk<T = TaskContext> {
    type: 'repeat';
    numIterations: number | ((ctx: T) => number);
    task: TaskDesk;
    valueName?: keyof T;
    label?: string;
}
export declare class RepeatTask<T extends TaskContext> extends LoopLikeTask<T> {
    private readonly task;
    private readonly numIterations;
    private readonly valueName;
    private iterationNum;
    constructor(task: Task<T>, numIterations: RepeatTaskDesk<T>['numIterations'], valueName: RepeatTaskDesk<T>['valueName'], label?: string);
    protected onSkipRequested(): void;
    protected onStopped(): void;
    protected onReset(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
