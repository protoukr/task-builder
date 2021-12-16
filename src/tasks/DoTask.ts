import { TaskContext, TaskCallback } from '../Task';
import { BaseTask } from '../BaseTask';

export interface DoTaskDesk<T> {
  type: 'do';
  func(ctx: T): void;
}

export class DoTask<T extends TaskContext> extends BaseTask<T> {
  constructor(private readonly func: DoTaskDesk<T>['func']) {
    super();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    try {
      this.func(ctx);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
