import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';
export declare abstract class LoopLikeTask<T extends TaskContext> extends BaseTask<T> {
    private readonly label?;
    constructor(label?: string | undefined);
    handleTaskMsg(callback: TaskCallback, msg?: unknown): boolean;
}
