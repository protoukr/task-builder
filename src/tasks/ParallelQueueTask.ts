import { BaseTask } from '../BaseTask';
import { TaskStatus, TaskCallback, Task, TaskContext, TaskDesk } from '../Task';

export interface ParallelQueueDesk {
  type: 'parallelQueue';
  tasks: TaskDesk[];
}

export class ParallelQueue<T extends TaskContext> extends BaseTask<T> {
  private numExecutedTasks = 0;

  constructor(private readonly tasks: Array<Task<T>>) {
    super();
  }

  protected onReset(): void {
    super.onReset();
    this.numExecutedTasks = 0;
  }

  protected onStopped(): void {
    super.onStopped();
    this.tasks
      .filter(({ status }) => status === TaskStatus.EXECUTING)
      .forEach((task) => task.stop());
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.tasks
      .filter(({ status }) => status === TaskStatus.EXECUTING)
      .forEach((task) => task.skip());
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    if (this.tasks.length === 0) {
      callback();
      return;
    }
    const onTaskCompleted = (msg?: unknown): void => {
      this.validateStatusAndCallback(callback);
      if (msg !== undefined) {
        callback(msg);
        return;
      }
      this.numExecutedTasks++;
      if (this.numExecutedTasks === this.tasks.length) {
        callback();
      }
    };
    this.tasks.forEach((task) => {
      task.exec(ctx, onTaskCompleted);
    });
  }
}
