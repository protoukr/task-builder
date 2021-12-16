import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { BaseTask } from '../BaseTask';

export interface QueueDesk {
  type: 'queue';
  tasks: TaskDesk[];
}

export class Queue<T extends TaskContext> extends BaseTask<T> {
  private taskNum = 0;
  private task?: Task<T>;

  constructor(private readonly tasks: Array<Task<T>>) {
    super();
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.task?.skip();
  }

  protected onReset(): void {
    super.onReset();
    this.taskNum = 0;
    this.task = undefined;
  }

  protected onStopped(): void {
    super.onStopped();
    this.task?.stop();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const executeTask = (): void => {
      if (this.taskNum < this.tasks.length) {
        this.task = this.tasks[this.taskNum++];
        this.task.exec(ctx, onTaskExecuted);
      } else {
        callback();
      }
    };
    const onTaskExecuted = (msg?: unknown): void => {
      this.validateStatusAndCallback(callback);
      if (msg === undefined) {
        executeTask();
      } else {
        callback(msg);
      }
    };
    executeTask();
  }
}
