import { evaluateValue, assignValueToContext } from '../BaseTask';
import { Task, TaskCallback, TaskContext, TaskDesk } from '../Task';
import { LoopLikeTask } from './LoopLikeTask';

export interface RepeatTaskDesk<T = TaskContext> {
  type: 'repeat';
  numIterations: number | ((ctx: T) => number);
  task: TaskDesk;
  valueName?: keyof T;
  label?: string;
}

export class RepeatTask<T extends TaskContext> extends LoopLikeTask<T> {
  private iterationNum = 0;

  constructor(
    private readonly task: Task<T>,
    private readonly numIterations: RepeatTaskDesk<T>['numIterations'],
    private readonly valueName: RepeatTaskDesk<T>['valueName'],
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

  protected onReset(): void {
    super.onReset();
    this.iterationNum = 0;
  }

  protected onExec(ctx: T, callback: TaskCallback): void {
    const numIterations = evaluateValue(ctx, this.numIterations);
    const executeTask = (): void => {
      if (this.iterationNum < numIterations) {
        ctx = assignValueToContext(ctx, this.valueName, this.iterationNum);
        this.iterationNum++;
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
