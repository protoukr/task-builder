import { Hooks } from './Hooks';
import { Task, TaskContext, TaskDesk } from './Task';
import {
  DelayTask,
  DelayTaskDesk,
  DelayTaskSetTimeout,
  DoTask,
  DoTaskDesk,
  ForEachTask,
  ForEachTaskDesk,
  HookTask,
  HookTaskDesk,
  IfTask,
  IfTaskDesk,
  ParallelQueue,
  ParallelQueueDesk,
  PromiseTask,
  Queue,
  QueueDesk,
  RepeatTask,
  RepeatTaskDesk,
  WhenTask,
  WhenTaskDesk,
  PromiseTaskDesk,
  WhileTask,
  WhileTaskDesk,
  BreakTask,
  BreakTaskDesk,
  ContinueTaskDesk,
  ContinueTask,
} from './tasks';

export interface ExternalTaskDesk<T extends TaskContext> {
  type: 'task';
  task: Task<T>;
}

export class TaskInflater<T extends TaskContext> {
  constructor(
    readonly hooks = new Hooks(),
    private readonly setTimeout?: DelayTaskSetTimeout
  ) {}

  inflate(desc: TaskDesk): Task<T> {
    const customTask = this.inflateCustomTask(desc);
    if (customTask != null) {
      return customTask;
    }
    switch (desc.type) {
      case 'queue':
        return this.inflateQueueTask(desc as QueueDesk);
      case 'parallelQueue':
        return this.inflateParallelQueueTask(desc as ParallelQueueDesk);
      case 'while':
        return this.inflateWhileTask(desc as WhileTaskDesk<T>);
      case 'if':
        return this.inflateIfTask(desc as IfTaskDesk<T>);
      case 'when':
        return this.inflateWhenTask(desc as WhenTaskDesk<T>);
      case 'delay':
        return this.inflateDelayTask(desc as DelayTaskDesk<T>);
      case 'do':
        return this.inflateDoTask(desc as DoTaskDesk<T>);
      case 'wait':
        return this.inflatePromiseTask(desc as PromiseTaskDesk<T>);
      case 'hook':
        return this.inflateHookTask(desc as HookTaskDesk);
      case 'task':
        return this.inflateTask(desc as ExternalTaskDesk<T>);
      case 'forEach':
        return this.inflateForEachTask(desc as ForEachTaskDesk<T>);
      case 'repeat':
        return this.inflateRepeatTask(desc as RepeatTaskDesk<T>);
      case 'break':
        return this.inflateBreakTask(desc as BreakTaskDesk);
      case 'continue':
        return this.inflateContinueTask(desc as ContinueTaskDesk);
      default:
        throw new Error(`Unknown task type: ${desc.type}`);
    }
  }

  protected inflateCustomTask(desc: TaskDesk): Task<T> | null {
    return null;
  }

  private inflateQueueTask({ tasks }: QueueDesk): Task<T> {
    return new Queue<T>(this.inflateTasks(tasks));
  }

  private inflateParallelQueueTask({ tasks }: ParallelQueueDesk): Task<T> {
    return new ParallelQueue<T>(this.inflateTasks(tasks));
  }

  private inflateWhileTask({
    condition,
    task,
    label,
  }: WhileTaskDesk<T>): Task<T> {
    return new WhileTask<T>(this.inflate(task), condition, label);
  }

  private inflateIfTask(desk: IfTaskDesk<T>): Task<T> {
    return new IfTask<T>(
      desk.condition,
      this.inflate(desk.ifTask),
      desk.elseIfTasks.map(({ condition, task }) => ({
        condition,
        task: this.inflate(task),
      })),
      desk.elseTask != null ? this.inflate(desk.elseTask) : undefined
    );
  }

  private inflateWhenTask(desk: WhenTaskDesk<T>): Task<T> {
    return new WhenTask<T>(
      desk.value,
      desk.isTasks.map(({ condition, task }) => ({
        condition,
        task: this.inflate(task),
      })),
      desk.otherwiseTask != null ? this.inflate(desk.otherwiseTask) : undefined
    );
  }

  private inflateDelayTask({ time }: DelayTaskDesk<T>): Task<T> {
    return new DelayTask<T>(time, this.setTimeout);
  }

  private inflateBreakTask({ label }: BreakTaskDesk): Task<T> {
    return new BreakTask(label);
  }

  private inflateContinueTask({ label }: ContinueTaskDesk): Task<T> {
    return new ContinueTask(label);
  }

  private inflateDoTask({ func }: DoTaskDesk<T>): Task<T> {
    return new DoTask<T>(func);
  }

  private inflatePromiseTask(desc: PromiseTaskDesk<T>): Task<T> {
    return new PromiseTask<T>(
      desc.promise,
      desc.skipCallback,
      desc.stopCallback
    );
  }

  private inflateRepeatTask({
    task,
    numIterations,
    valueName,
    label,
  }: RepeatTaskDesk<T>): Task<T> {
    return new RepeatTask<T>(
      this.inflate(task),
      numIterations,
      valueName,
      label
    );
  }

  private inflateForEachTask({
    values,
    valueName,
    task,
    label,
  }: ForEachTaskDesk<T>): Task<T> {
    return new ForEachTask<T>(this.inflate(task), values, valueName, label);
  }

  private inflateTask({ task }: ExternalTaskDesk<T>): Task<T> {
    return task;
  }

  private inflateHookTask({ name }: HookTaskDesk): Task<T> {
    return new HookTask<T>(name, this.hooks);
  }

  private inflateTasks(tasks: TaskDesk[]): Array<Task<T>> {
    return tasks.map((desk) => this.inflate(desk));
  }
}
