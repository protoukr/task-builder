import { BaseTask } from '../BaseTask';
import { TaskContext, TaskCallback } from '../Task';
declare type ClearTimeout = () => void;
export declare type DelayTaskSetTimeout = (callback: () => void, time: number) => ClearTimeout;
export interface DelayTaskDesk<T = TaskContext> {
    type: 'delay';
    time: number | ((ctx: T) => number);
}
export declare class DelayTask<T extends TaskContext> extends BaseTask<T> {
    private readonly time;
    private readonly setTimeout;
    private clearTimeout?;
    constructor(time: DelayTaskDesk<T>['time'], setTimeout?: DelayTaskSetTimeout);
    protected onStopped(): void;
    protected onSkipRequested(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
export {};
