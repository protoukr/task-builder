import { evaluateValue, BaseTask } from '../BaseTask';
import { TaskDesk, Task, TaskContext, TaskCallback } from '../Task';

export type WhenIsTaskCondition<T> = (value: unknown, ctx: T) => boolean;

export interface WhenTaskDesk<T = TaskContext> {
  type: 'when';
  value: unknown | ((ctx: T) => unknown);
  isTasks: Array<{ condition: WhenIsTaskCondition<T>; task: TaskDesk }>;
  otherwiseTask?: TaskDesk;
}

export class WhenTask<T extends TaskContext> extends BaseTask<T> {
  private task?: Task<T>;

  constructor(
    private readonly value: WhenTaskDesk<T>['value'],
    private readonly isTasks: Array<{
      condition: WhenIsTaskCondition<T>;
      task: Task<T>;
    }>,
    private readonly otherwiseTask?: Task<T>
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

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.task?.skip();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    this.task = this.evaluateTask(ctx);
    if (this.task != null) {
      this.task.exec(ctx, (msg) => {
        this.validateStatusAndCallback(callback);
        callback(msg);
      });
    } else {
      callback();
    }
  }

  private evaluateTask(ctx: T): Task<T> | undefined {
    const value = evaluateValue(ctx, this.value);
    const foundTask = this.isTasks.find((task) => task.condition(value, ctx));
    if (foundTask != null) {
      return foundTask.task;
    }
    return this.otherwiseTask;
  }
}
