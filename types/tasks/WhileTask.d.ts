import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';
export interface WhileTaskDesk<T = TaskContext> {
    type: 'while';
    condition(ctx: T): boolean;
    task: TaskDesk;
    label?: string;
}
export declare class WhileTask<T extends TaskContext> extends LoopLikeTask<T> {
    private readonly task;
    private readonly condition;
    constructor(task: Task<T>, condition: WhileTaskDesk<T>['condition'], label?: string);
    protected onSkipRequested(): void;
    protected onStopped(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
