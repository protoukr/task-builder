import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';
export interface BreakTaskDesk {
    type: 'break';
    label?: string;
}
export declare class Break {
    readonly label?: string | undefined;
    constructor(label?: string | undefined);
}
export declare class BreakTask<T extends TaskContext> extends BaseTask<T> {
    private readonly label?;
    constructor(label?: string | undefined);
    protected onExec(ctx: T, callback: TaskCallback): void;
}
