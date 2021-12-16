import { describe, it } from 'mocha';
import { TaskFactory } from '../../src/TaskFactory';

describe('PromiseTask', () => {
  it('checks if promise resolving ', async () => {
    const task = new TaskFactory().wait(() => Promise.resolve());

    await task.exec();
  });

  it('checks if promise rejecting ', async () => {
    const task = new TaskFactory().wait(() => Promise.reject(new Error()));

    await task.exec().catch(() => {});
  });
});
