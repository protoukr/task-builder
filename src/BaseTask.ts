import {
  getTaskStatusName,
  Task,
  TaskCallback,
  TaskContext,
  TaskStatus,
} from './Task';

export function evaluateValue<T, V>(ctx: T, value: ((ctx: T) => V) | V): V {
  if (typeof value === 'function') {
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37663
    return value(ctx);
  }
  return value;
}

export function assignValueToContext<T extends TaskContext, K extends keyof T>(
  ctx: T,
  valueName?: K,
  value?: unknown
): T {
  if (ctx === undefined || valueName === undefined || value === undefined) {
    return ctx;
  }
  return {
    ...ctx,
    [valueName]: value,
  };
}

export abstract class BaseTask<T extends TaskContext = TaskContext>
  implements Task<T>
{
  status = TaskStatus.PENDING;

  private _callback?: TaskCallback;

  private _ctx?: T;

  isInState(state: TaskStatus): boolean {
    return this.status === state;
  }

  exec(ctx: T): Promise<void>;
  exec(ctx: T, callback: (msg?: unknown) => void): void;
  exec(ctx: T, callback?: (msg?: unknown) => void): Promise<void> | void {
    this._ctx = ctx;
    this.setStatus(TaskStatus.PENDING);
    this.setStatus(TaskStatus.EXECUTING);
    if (callback != null) {
      this._exec(ctx, callback);
      return;
    }
    return new Promise((resolve, reject) => {
      this._exec(ctx, (msg) => {
        if (msg !== undefined && msg instanceof Error) {
          reject(msg);
        } else {
          resolve();
        }
      });
    });
  }

  stop(): void {
    this.setStatus(TaskStatus.PENDING);
  }

  skip(): void {
    if (this.isInState(TaskStatus.EXECUTING)) {
      this.onSkipRequested();
    }
  }

  protected get callback(): TaskCallback {
    if (this._callback == null) {
      throw new Error('Task callback is not defined');
    }
    return this._callback;
  }

  protected get ctx(): T {
    if (this._ctx == null) {
      throw new Error('Task context is not defined');
    }
    return this._ctx;
  }

  protected abstract onExec(ctx: T, callback: TaskCallback): void;

  protected setStatus(status: TaskStatus): void {
    if (this.status === status) {
      return;
    }
    this.validateTransition(status);
    const prevStatus = this.status;
    this.status = status;
    this.onStatusChanged(prevStatus);
  }

  protected onStatusChanged(prevStatus: TaskStatus): void {
    if (this.status === TaskStatus.PENDING) {
      if (prevStatus === TaskStatus.EXECUTING) {
        this.onStopped();
      }
      this.onReset();
    } else if (this.status === TaskStatus.COMPLETED) {
      this.onCompleted();
    }
  }

  protected onReset(): void {}

  protected onCompleted(): void {}

  protected onStopped(): void {}

  protected onSkipRequested(): void {}

  protected forceComplete(): void {
    this._callback?.();
  }

  protected validateStatusAndCallback(callback: TaskCallback): void {
    if (this.status !== TaskStatus.EXECUTING) {
      throw new Error(`Task is not executing`);
    }
    if (this._callback !== callback) {
      throw new Error('Task callback is invalid');
    }
  }

  private validateTransition(newStatus: TaskStatus): void {
    if (!this.checkTransitionValidity(newStatus)) {
      const currStatusName = getTaskStatusName(this.status);
      const newStatusName = getTaskStatusName(newStatus);
      throw new Error(
        `Invalid transition from ${currStatusName} to ${newStatusName}`
      );
    }
  }

  protected checkTransitionValidity(newStatus: TaskStatus): boolean {
    if (this.status === TaskStatus.PENDING) {
      return newStatus === TaskStatus.EXECUTING;
    }
    if (this.status === TaskStatus.EXECUTING) {
      return (
        newStatus === TaskStatus.COMPLETED || newStatus === TaskStatus.PENDING
      );
    }
    return newStatus === TaskStatus.PENDING;
  }

  private _exec(ctx: T, callback: TaskCallback): void {
    this._callback = (msg?: unknown) => {
      if (this.isInState(TaskStatus.EXECUTING)) {
        this.setStatus(TaskStatus.COMPLETED);
        callback(msg);
      }
    };
    this.onExec(ctx, this._callback);
  }
}
