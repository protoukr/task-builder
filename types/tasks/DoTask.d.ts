import { TaskContext, TaskCallback } from '../Task';
import { BaseTask } from '../BaseTask';
export interface DoTaskDesk<T> {
    type: 'do';
    func(ctx: T): void;
}
export declare class DoTask<T extends TaskContext> extends BaseTask<T> {
    private readonly func;
    constructor(func: DoTaskDesk<T>['func']);
    protected onExec(ctx: T, callback: TaskCallback): void;
}
