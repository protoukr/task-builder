import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';

export interface ContinueTaskDesk {
  type: 'continue';
  label?: string;
}

export class Continue {
  constructor(readonly label?: string) {}
}

export class ContinueTask<T extends TaskContext> extends BaseTask<T> {
  constructor(private readonly label?: string) {
    super();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    callback(new Continue(this.label));
  }
}
