import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';

export interface WhileTaskDesk<T = TaskContext> {
  type: 'while';
  condition(ctx: T): boolean;
  task: TaskDesk;
  label?: string;
}

export class WhileTask<T extends TaskContext> extends LoopLikeTask<T> {
  constructor(
    private readonly task: Task<T>,
    private readonly condition: WhileTaskDesk<T>['condition'],
    label?: string
  ) {
    super(label);
  }

  protected onSkipRequested(): void {
    super.onSkipRequested();
    this.task.skip();
  }

  protected onStopped(): void {
    super.onStopped();
    this.task.stop();
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const executeTask = (): void => {
      if (this.condition(ctx)) {
        this.task.exec(ctx, onTaskExecuted);
      } else {
        callback();
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
