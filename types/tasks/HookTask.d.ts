import { BaseTask } from '../BaseTask';
import { Hooks } from '../Hooks';
import { TaskContext, TaskCallback } from '../Task';
export interface HookTaskDesk {
    type: 'hook';
    name: string;
}
export declare class HookTask<T extends TaskContext> extends BaseTask<T> {
    private readonly hookName;
    private readonly hooks;
    private task?;
    constructor(hookName: HookTaskDesk['name'], hooks: Hooks);
    protected onReset(): void;
    protected onStopped(): void;
    protected onExec(ctx: T, callback: TaskCallback): void;
}
