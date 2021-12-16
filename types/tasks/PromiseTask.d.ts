import { TaskContext, TaskCallback } from '../Task';
import { BaseTask } from '../BaseTask';
export interface PromiseTaskDesk<T> {
    type: 'wait';
    promise(ctx: T): Promise<unknown>;
    skipCallback?(): Promise<unknown> | void;
    stopCallback?(): void;
}
export declare class PromiseTask<T extends TaskContext> extends BaseTask<T> {
    private readonly promise;
    private readonly skipCallback;
    private readonly stopCallback;
    private isSkipping;
    constructor(promise: PromiseTaskDesk<T>['promise'], skipCallback: PromiseTaskDesk<T>['skipCallback'], stopCallback: PromiseTaskDesk<T>['stopCallback']);
    protected onStopped(): void;
    protected onReset(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
