import { BaseTask } from '../BaseTask';
import { TaskCallback, TaskContext } from '../Task';

export interface BreakTaskDesk {
  type: 'break';
  label?: string;
}

export class Break {
  constructor(readonly label?: string) {}
}

export class BreakTask<T extends TaskContext> extends BaseTask<T> {
  constructor(private readonly label?: string) {
    super();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    callback(new Break(this.label));
  }
}
