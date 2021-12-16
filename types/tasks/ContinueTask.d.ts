import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';
export interface ContinueTaskDesk {
    type: 'continue';
    label?: string;
}
export declare class Continue {
    readonly label?: string | undefined;
    constructor(label?: string | undefined);
}
export declare class ContinueTask<T extends TaskContext> extends BaseTask<T> {
    private readonly label?;
    constructor(label?: string | undefined);
    protected onExec(ctx: T, callback: TaskCallback): void;
}
