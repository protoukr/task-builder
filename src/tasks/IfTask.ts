import { BaseTask } from '../BaseTask';
import { Task, TaskContext, TaskDesk, TaskCallback } from '../Task';

export interface IfTaskDesk<T = TaskContext> {
  type: 'if';
  condition(ctx: T): boolean;
  ifTask: TaskDesk;
  elseIfTasks: Array<{ condition(ctx: T): unknown; task: TaskDesk }>;
  elseTask?: TaskDesk;
}

export class IfTask<T extends TaskContext> extends BaseTask<T> {
  private task?: Task<T>;

  constructor(
    private readonly condition: IfTaskDesk<T>['condition'],
    private readonly ifTask: Task<T>,
    private readonly elseIfTasks?: Array<{
      condition(ctx: T): unknown;
      task: Task<T>;
    }>,
    private readonly elseTask?: Task<T>
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
    if (this.condition(ctx)) {
      return this.ifTask;
    }
    const foundTask = this.elseIfTasks?.find(({ condition }) => condition(ctx));
    if (foundTask != null) {
      return foundTask.task;
    }
    return this.elseTask;
  }
}
