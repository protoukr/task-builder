import { BaseTask } from '../BaseTask';
import { Hooks } from '../Hooks';
import { ParallelQueue } from './ParallelQueueTask';
import { Task, TaskContext, TaskCallback } from '../Task';

export interface HookTaskDesk {
  type: 'hook';
  name: string;
}

export class HookTask<T extends TaskContext> extends BaseTask<T> {
  private task?: Task<T>;

  constructor(
    private readonly hookName: HookTaskDesk['name'],
    private readonly hooks: Hooks
  ) {
    super();
  }

  protected onReset(): void {
    super.onReset();
    this.task = undefined;
  }

  protected onStopped(): void {
    super.onStopped();
    this.task?.stop();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const tasks = this.hooks.hookTasks<T>(this.hookName);
    if (tasks.length > 0) {
      this.task = new ParallelQueue<T>(tasks);
      this.task.exec(ctx, callback);
    } else {
      callback();
    }
  }
}
