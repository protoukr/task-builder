import { evaluateValue, assignValueToContext } from '../BaseTask';
import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';

export interface ForEachTaskDesk<T = TaskContext> {
  type: 'forEach';
  values: Iterable<unknown> | ((ctx: T) => Iterable<unknown>);
  task: TaskDesk;
  label?: string;
  valueName?: keyof T;
}

export class ForEachTask<T extends TaskContext> extends LoopLikeTask<T> {
  constructor(
    private readonly task: Task<T>,
    private readonly values: ForEachTaskDesk<T>['values'],
    private readonly valueName: ForEachTaskDesk<T>['valueName'],
    label?: string
  ) {
    super(label);
  }

  protected onStopped(): void {
    super.onStopped();
    this.task.stop();
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.task.skip();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const values = evaluateValue(ctx, this.values);
    const iterator = values[Symbol.iterator]();
    const executeTask = (): void => {
      const { value, done } = iterator.next();
      if (done === true) {
        callback();
      } else {
        ctx = assignValueToContext(ctx, this.valueName, value);
        this.task.exec(ctx, onTaskExecuted);
      }
    };
    const onTaskExecuted = (msg?: unknown): void => {
      this.validateStatusAndCallback(callback);
      if (!this.handleTaskMsg(callback, msg)) {
        executeTask();
      }
    };
    executeTask();
  }
}
