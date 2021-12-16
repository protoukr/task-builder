import { Hooks } from './Hooks';
import { Task, TaskContext, TaskDesk } from './Task';
import { DelayTaskSetTimeout } from './tasks';
export interface ExternalTaskDesk<T extends TaskContext> {
    type: 'task';
    task: Task<T>;
}
export declare class TaskInflater<T extends TaskContext> {
    readonly hooks: Hooks;
    private readonly setTimeout?;
    constructor(hooks?: Hooks, setTimeout?: DelayTaskSetTimeout | undefined);
    inflate(desc: TaskDesk): Task<T>;
    protected inflateCustomTask(desc: TaskDesk): Task<T> | null;
    private inflateQueueTask;
    private inflateParallelQueueTask;
    private inflateWhileTask;
    private inflateIfTask;
    private inflateWhenTask;
    private inflateDelayTask;
    private inflateBreakTask;
    private inflateContinueTask;
    private inflateDoTask;
    private inflatePromiseTask;
    private inflateRepeatTask;
    private inflateForEachTask;
    private inflateTask;
    private inflateHookTask;
    private inflateTasks;
}
