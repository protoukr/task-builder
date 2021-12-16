import { Task, TaskContext, TaskDesk } from '../Task';
import { TaskBuilder } from '../TaskBuilder';
import { ExternalTaskDesk } from '../TaskInflater';
import {
  BreakTaskDesk,
  ContinueTaskDesk,
  DelayTaskDesk,
  DoTaskDesk,
  ForEachTaskDesk,
  HookTaskDesk,
  IfTaskDesk,
  ParallelQueueDesk,
  PromiseTaskDesk,
  QueueDesk,
  RepeatTaskDesk,
  WhenIsTaskCondition,
  WhenTaskDesk,
  WhileTaskDesk,
} from '../tasks';
import { AbstractTaskBuilder } from './AbstractTaskBuilder';

export type PushTaskBuilderDescToParent<T extends TaskContext> = (
  desc: AbstractTaskBuilder<T>
) => AbstractTaskBuilder<T>;

export abstract class AbstractQueueTaskBuilder<
  T extends TaskContext
> extends AbstractTaskBuilder<T> {
  protected readonly tasksDesc: TaskDesk[] = [];

  constructor(private readonly pushToParent: PushTaskBuilderDescToParent<T>) {
    super();
  }

  do(func: DoTaskDesk<T>['func']): TaskBuilder<T> {
    const desc: DoTaskDesk<T> = { type: 'do', func };
    return this.pushTaskDesk(desc);
  }

  wait(
    promise: PromiseTaskDesk<T>['promise'],
    onSkipped?: PromiseTaskDesk<T>['skipCallback'],
    onStopped?: PromiseTaskDesk<T>['stopCallback']
  ): TaskBuilder<T> {
    const desc: PromiseTaskDesk<T> = {
      type: 'wait',
      promise,
      skipCallback: onSkipped,
    };
    return this.pushTaskDesk(desc);
  }

  delay(time: DelayTaskDesk<T>['time']): TaskBuilder<T> {
    const desc: DelayTaskDesk<T> = { type: 'delay', time };
    return this.pushTaskDesk(desc);
  }

  hook(name: HookTaskDesk['name']): TaskBuilder<T> {
    const desc: HookTaskDesk = { type: 'hook', name };
    return this.pushTaskDesk(desc);
  }

  task(task: Task<T>): TaskBuilder<T> {
    const desc: ExternalTaskDesk<T> = { type: 'task', task };
    return this.pushTaskDesk(desc);
  }

  parallelQueue(): TaskBuilder<T> {
    return new ParallelQueueTaskBuilder<T>(this.pushTaskBuilderDesc);
  }

  queue(): TaskBuilder<T> {
    return new QueueTaskBuilder<T>(this.pushTaskBuilderDesc);
  }

  forEach(
    collection: ForEachTaskDesk<T>['values'],
    valueName: ForEachTaskDesk<T>['valueName'],
    label?: string
  ): TaskBuilder<T> {
    return new ForEachTaskBuilder<T>(
      this.pushTaskBuilderDesc,
      collection,
      valueName,
      label
    );
  }

  repeat(
    numIterations: RepeatTaskDesk<T>['numIterations'],
    valueName: RepeatTaskDesk<T>['valueName'],
    label?: string
  ): TaskBuilder<T> {
    return new RepeatTaskBuilder<T>(
      numIterations,
      valueName,
      this.pushTaskBuilderDesc,
      label
    );
  }

  break(label?: string): TaskBuilder<T> {
    const desc: BreakTaskDesk = { type: 'break', label };
    return this.pushTaskDesk(desc);
  }

  continue(label?: string): TaskBuilder<T> {
    const desc: ContinueTaskDesk = { type: 'continue', label };
    return this.pushTaskDesk(desc);
  }

  while(
    condition: WhileTaskDesk<T>['condition'],
    label?: string
  ): TaskBuilder<T> {
    return new WhileTaskBuilder<T>(condition, this.pushTaskBuilderDesc, label);
  }

  if(condition: IfTaskDesk<T>['condition']): TaskBuilder<T> {
    return new IfTaskBuilder<T>(condition, this.pushTaskBuilderDesc);
  }

  when(value: WhenTaskDesk<T>['value']): TaskBuilder<T> {
    return new WhenTaskBuilder<T>(value, this.pushTaskBuilderDesc);
  }

  end(): TaskBuilder<T> {
    return this.pushToParent(this);
  }

  getLegalOperations(): string[] {
    return [
      'end',
      'do',
      'wait',
      'delay',
      'hook',
      'task',
      'parallelQueue',
      'queue',
      'forEach',
      'async',
      'repeat',
      'while',
      'if',
      'when',
      'break',
      'continue',
      'build',
    ];
  }

  build(): Task<T> {
    return this.end().build();
  }

  protected pushTaskDesk(taskDesk: TaskDesk): AbstractTaskBuilder<T> {
    this.tasksDesc.push(taskDesk);
    return this;
  }

  private readonly pushTaskBuilderDesc = (
    builder: AbstractTaskBuilder<T>
  ): AbstractTaskBuilder<T> => {
    return this.pushTaskDesk(builder.getDesc());
  };
}

export class ParallelQueueTaskBuilder<
  T extends TaskContext
> extends AbstractQueueTaskBuilder<T> {
  getDesc(): TaskDesk {
    const desc: ParallelQueueDesk = {
      type: 'parallelQueue',
      tasks: this.tasksDesc,
    };
    return desc;
  }
}

export class QueueTaskBuilder<
  T extends TaskContext
> extends AbstractQueueTaskBuilder<T> {
  getDesc(): TaskDesk {
    const desc: QueueDesk = {
      type: 'queue',
      tasks: this.tasksDesc,
    };
    return desc;
  }
}

export class RepeatTaskBuilder<
  T extends TaskContext
> extends QueueTaskBuilder<T> {
  constructor(
    private readonly numIterations: RepeatTaskDesk<T>['numIterations'],
    private readonly valueName: RepeatTaskDesk<T>['valueName'],
    pushToParent: PushTaskBuilderDescToParent<T>,
    private readonly label?: string
  ) {
    super(pushToParent);
  }

  getDesc(): TaskDesk {
    const desc: RepeatTaskDesk<T> = {
      type: 'repeat',
      task: super.getDesc(),
      numIterations: this.numIterations,
      valueName: this.valueName,
      label: this.label,
    };
    return desc;
  }
}

class WhenIsTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
  is(value: WhenIsTaskCondition<T>): TaskBuilder<T> {
    return super.end().is(value);
  }

  otherwise(): TaskBuilder<T> {
    return super.end().otherwise();
  }

  end(): TaskBuilder<T> {
    return super.end().end();
  }

  getLegalOperations(): string[] {
    return super.getLegalOperations().concat(['otherwise', 'is']);
  }
}

class DefaultTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
  end(): TaskBuilder<T> {
    return super.end().end();
  }
}

export class WhenTaskBuilder<
  T extends TaskContext
> extends AbstractTaskBuilder<T> {
  private readonly isTasks: Array<{
    condition: WhenIsTaskCondition<T>;
    task: TaskDesk;
  }> = [];

  private defaultTask?: TaskDesk;

  constructor(
    private readonly value: WhenTaskDesk<T>['value'],
    private readonly parent: PushTaskBuilderDescToParent<T>
  ) {
    super();
  }

  is(condition: WhenIsTaskCondition<T>): TaskBuilder<T> {
    return new WhenIsTaskBuilder<T>((builder) => {
      this.isTasks.push({ condition, task: builder.getDesc() });
      return this;
    });
  }

  end(): TaskBuilder<T> {
    return this.parent(this);
  }

  otherwise(): TaskBuilder<T> {
    return new DefaultTaskBuilder<T>((builder) => {
      this.defaultTask = builder.getDesc();
      return this;
    });
  }

  getLegalOperations(): string[] {
    return ['otherwise', 'is', 'end'];
  }

  getDesc(): TaskDesk {
    const desc: WhenTaskDesk<T> = {
      type: 'when',
      value: this.value,
      isTasks: this.isTasks,
      otherwiseTask: this.defaultTask,
    };
    return desc;
  }
}

export class WhileTaskBuilder<
  T extends TaskContext
> extends QueueTaskBuilder<T> {
  constructor(
    private readonly condition: WhileTaskDesk<T>['condition'],
    pushToParent: PushTaskBuilderDescToParent<T>,
    private readonly label?: string
  ) {
    super(pushToParent);
  }

  getDesc(): TaskDesk {
    const desc: WhileTaskDesk<T> = {
      type: 'while',
      task: super.getDesc(),
      condition: this.condition,
      label: this.label,
    };
    return desc;
  }
}

class ElseIfTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
  else(): TaskBuilder<T> {
    return super.end().else();
  }

  elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T> {
    return super.end().elseif(condition);
  }

  end(): TaskBuilder<T> {
    return super.end().end();
  }

  getLegalOperations(): string[] {
    return super.getLegalOperations().concat(['else', 'elseif']);
  }
}

class ElseTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
  end(): TaskBuilder<T> {
    return super.end().end();
  }
}

export class IfTaskBuilder<T extends TaskContext> extends QueueTaskBuilder<T> {
  private readonly elseIfTasks: Array<{
    condition: IfTaskDesk<T>['condition'];
    task: TaskDesk;
  }> = [];

  private elseTask?: TaskDesk;

  constructor(
    private readonly condition: IfTaskDesk<T>['condition'],
    parent: PushTaskBuilderDescToParent<T>
  ) {
    super(parent);
  }

  elseif(condition: IfTaskDesk<T>['condition']): TaskBuilder<T> {
    return new ElseIfTaskBuilder<T>((builder) => {
      this.elseIfTasks.push({ condition, task: builder.getDesc() });
      return this;
    });
  }

  else(): TaskBuilder<T> {
    return new ElseTaskBuilder<T>((builder) => {
      this.elseTask = builder.getDesc();
      return this;
    });
  }

  getLegalOperations(): string[] {
    return super.getLegalOperations().concat(['else', 'elseif']);
  }

  getDesc(): TaskDesk {
    const desc: IfTaskDesk<T> = {
      type: 'if',
      condition: this.condition,
      ifTask: super.getDesc(),
      elseIfTasks: this.elseIfTasks,
      elseTask: this.elseTask,
    };
    return desc;
  }
}

export class ForEachTaskBuilder<
  T extends TaskContext
> extends QueueTaskBuilder<T> {
  constructor(
    parent: PushTaskBuilderDescToParent<T>,
    private readonly collection: ForEachTaskDesk<T>['values'],
    private readonly valueName: ForEachTaskDesk<T>['valueName'],
    private readonly label?: string
  ) {
    super(parent);
  }

  getDesc(): TaskDesk {
    const desc: ForEachTaskDesk<T> = {
      type: 'forEach',
      task: super.getDesc(),
      values: this.collection,
      valueName: this.valueName,
      label: this.label,
    };
    return desc;
  }
}
