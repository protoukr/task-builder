import { BaseTask, evaluateValue } from '../BaseTask';
import { TaskContext, TaskCallback } from '../Task';

type ClearTimeout = () => void;
export type DelayTaskSetTimeout = (
  callback: () => void,
  time: number
) => ClearTimeout;

export interface DelayTaskDesk<T = TaskContext> {
  type: 'delay';
  time: number | ((ctx: T) => number);
}

function _setTimeout(callback: () => void, time: number): () => void {
  const id = setTimeout(callback, time);
  return () => clearTimeout(id);
}

export class DelayTask<T extends TaskContext> extends BaseTask<T> {
  private clearTimeout?: ClearTimeout;

  constructor(
    private readonly time: DelayTaskDesk<T>['time'],
    private readonly setTimeout: DelayTaskSetTimeout = _setTimeout
  ) {
    super();
  }

  protected onStopped(): void {
    super.onStopped();
    this.clearTimeout?.();
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.clearTimeout?.();
    this.forceComplete();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const time = evaluateValue(ctx, this.time);
    this.clearTimeout = this.setTimeout(callback, time);
  }
}
