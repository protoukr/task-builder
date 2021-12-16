import { TaskContext, TaskCallback } from '../Task';
import { BaseTask } from '../BaseTask';

export interface PromiseTaskDesk<T> {
  type: 'wait';
  promise(ctx: T): Promise<unknown>;
  skipCallback?(): Promise<unknown> | void;
  stopCallback?(): void;
}

export class PromiseTask<T extends TaskContext> extends BaseTask<T> {
  private isSkipping = false;

  constructor(
    private readonly promise: PromiseTaskDesk<T>['promise'],
    private readonly skipCallback: PromiseTaskDesk<T>['skipCallback'],
    private readonly stopCallback: PromiseTaskDesk<T>['stopCallback']
  ) {
    super();
  }

  protected onStopped(): void {
    super.onStopped();
    this.stopCallback?.();
  }

  protected onReset(): void {
    super.onReset();
    this.isSkipping = false;
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    if (this.isSkipping) {
      console.warn('PromiseTask: skip requested while already skipping');
      return;
    }
    this.isSkipping = true;
    const { callback } = this;
    void Promise.resolve(this.skipCallback?.()).then(() => {
      this.validateStatusAndCallback(callback);
      this.forceComplete();
    });
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    void this.promise(ctx)
      .catch((error) => {
        this.validateStatusAndCallback(callback);
        callback(error);
      })
      .then(() => {
        this.validateStatusAndCallback(callback);
        callback();
      });
  }
}
