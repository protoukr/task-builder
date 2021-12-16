import { describe, it } from 'mocha';
import { assert } from 'chai';
import { spy } from 'sinon';
import { TaskFactory } from '../../src/TaskFactory';

describe('BreakTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  describe('While', () => {
    it('checks breaking without label', async () => {
      let i = 0;
      // prettier-ignore
      const task = new TaskFactory()
        .while(() => i++ < 3)
          .while(() => true)
            .do(spyFunc)
            .break()
        .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks breaking with label', async () => {
      let i = 0;
      // prettier-ignore
      const task = new TaskFactory()
        .while(() => ++i < 3, 'label')
          .while(() => true)
            .do(spyFunc)
            .break('label')
          .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledOnce);
    });
  });

  describe('Repeat', () => {
    it('checks breaking without label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .repeat(() => 3)
          .repeat(() => Number.POSITIVE_INFINITY)
            .do(spyFunc)
            .break()
          .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks breaking with label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .repeat(() => 3)
          .repeat(() => Number.POSITIVE_INFINITY)
            .do(spyFunc)
            .break('label')
          .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledOnce);
    });
  });

  describe('ForEach', () => {
    it('checks breaking without label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .forEach(() => [0, 1, 2])
          .forEach(() => [0, 1, 2])
            .do(spyFunc)
            .break()
          .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks breaking with label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .forEach(() => [0, 1, 2], undefined, 'label')
          .forEach(() => [0, 1, 2])
            .do(spyFunc)
            .break('label')
          .end()
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledOnce);
    });
  });
});
