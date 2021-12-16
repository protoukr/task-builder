import { describe, it } from 'mocha';
import { assert } from 'chai';
import { spy } from 'sinon';
import { TaskFactory } from '../../src/TaskFactory';

describe('ContinueTask', () => {
  let spyFunc = spy();
  beforeEach(() => {
    spyFunc = spy();
  });

  describe('While', () => {
    it('checks continuing without label', async () => {
      let i = 0;
      let j = 0;
      // prettier-ignore
      const task = new TaskFactory()
        .while(() => i++ < 3)
          .while(() => j++ < 3)
            .continue()
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks continuing with label', async () => {
      let i = 0;
      let j = 0;
      // prettier-ignore
      const task = new TaskFactory()
        .while(() => i++ < 3, 'outer')
          .while(() => j++ < 3, 'inner')
            .continue('outer')
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.notCalled);
    });
  });

  describe('Repeat', () => {
    it('checks continuing without label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .repeat(3)
          .repeat(3)
            .continue()
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks continuing with label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .repeat(3, undefined, 'outer')
          .repeat(3, undefined, 'inner')
            .continue('outer')
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.notCalled);
    });
  });

  describe('ForEach', () => {
    it('checks continuing without label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .forEach([0, 1, 2])
          .forEach([0, 1, 2])
            .continue()
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.calledThrice);
    });

    it('checks continuing with label', async () => {
      // prettier-ignore
      const task = new TaskFactory()
        .forEach([0, 1, 2], undefined, 'outer')
          .forEach([0, 1, 2], undefined, 'inner')
            .continue('outer')
            .do(spyFunc)
          .end()
          .do(spyFunc)
        .build();

      await task.exec();

      assert.isTrue(spyFunc.notCalled);
    });
  });
});
