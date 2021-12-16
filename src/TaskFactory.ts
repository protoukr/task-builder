import {
  AbstractTaskBuilder,
  ForEachTaskBuilder,
  IfTaskBuilder,
  ParallelQueueTaskBuilder,
  QueueTaskBuilder,
  RepeatTaskBuilder,
  RootTaskBuilder,
  WhenTaskBuilder,
  WhileTaskBuilder,
} from './builders';
import { Hooks } from './Hooks';
import { Task, TaskContext } from './Task';
import { TaskBuilder } from './TaskBuilder';
import { TaskInflater } from './TaskInflater';
import {
  DelayTask,
  DelayTaskDesk,
  DelayTaskSetTimeout,
  DoTask,
  ForEachTaskDesk,
  IfTaskDesk,
  PromiseTask,
  PromiseTaskDesk,
  RepeatTaskDesk,
  WhenTaskDesk,
  WhileTaskDesk,
} from './tasks';

export class TaskFactory {
  get hooks(): Hooks {
    return this.inflater.hooks;
  }

  constructor(
    private readonly inflater: TaskInflater<TaskContext> = new TaskInflater(
      new Hooks()
    ),
    private readonly setTimeout?: DelayTaskSetTimeout
  ) {}

  parallelQueue<T extends TaskContext = void>(): TaskBuilder<T> {
    return new ParallelQueueTaskBuilder<T>(this.createRootBuilder);
  }

  while<T extends TaskContext = void>(
    condition: WhileTaskDesk<T>['condition'],
    label?: string
  ): TaskBuilder<T> {
    return new WhileTaskBuilder<T>(condition, this.createRootBuilder, label);
  }

  queue<T extends TaskContext = void>(): TaskBuilder<T> {
    return new QueueTaskBuilder<T>(this.createRootBuilder);
  }

  when<T extends TaskContext = void>(
    value: WhenTaskDesk<T>['value']
  ): TaskBuilder<T> {
    return new WhenTaskBuilder<T>(value, this.createRootBuilder);
  }

  if<T extends TaskContext = void>(
    condition: IfTaskDesk<T>['condition']
  ): TaskBuilder<T> {
    return new IfTaskBuilder<T>(condition, this.createRootBuilder);
  }

  forEach<T extends TaskContext = void>(
    collection: ForEachTaskDesk<T>['values'],
    valueName?: ForEachTaskDesk<T>['valueName'],
    label?: string
  ): TaskBuilder<T> {
    return new ForEachTaskBuilder<T>(
      this.createRootBuilder,
      collection,
      valueName,
      label
    );
  }

  delay<T extends TaskContext = void>(time: DelayTaskDesk<T>['time']): Task<T> {
    return new DelayTask<T>(time, this.setTimeout);
  }

  do<T extends TaskContext = void>(func: (ctx: T) => void): Task<T> {
    return new DoTask<T>(func);
  }

  repeat<T extends TaskContext = void>(
    numIterations: RepeatTaskDesk<T>['numIterations'],
    valueName?: RepeatTaskDesk<T>['valueName'],
    label?: string
  ): TaskBuilder<T> {
    return new RepeatTaskBuilder<T>(
      numIterations,
      valueName,
      this.createRootBuilder,
      label
    );
  }

  wait<T extends TaskContext = void>(
    promise: PromiseTaskDesk<T>['promise'],
    onSkipped?: PromiseTaskDesk<T>['skipCallback'],
    onStopped?: PromiseTaskDesk<T>['stopCallback']
  ): Task<T> {
    return new PromiseTask<T>(promise, onSkipped, onStopped);
  }

  private readonly createRootBuilder = <T extends TaskContext>(
    builder: AbstractTaskBuilder<T>
  ): AbstractTaskBuilder<T> => {
    return new RootTaskBuilder<T>(this.inflater, builder);
  };
}
