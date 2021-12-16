"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseTask = void 0;
const BaseTask_1 = require("../BaseTask");
class PromiseTask extends BaseTask_1.BaseTask {
    constructor(promise, skipCallback, stopCallback) {
        super();
        this.promise = promise;
        this.skipCallback = skipCallback;
        this.stopCallback = stopCallback;
        this.isSkipping = false;
    }
    onStopped() {
        var _a;
        super.onStopped();
        (_a = this.stopCallback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    onReset() {
        super.onReset();
        this.isSkipping = false;
    }
    onSkipRequested() {
        var _a;
        super.onSkipRequested();
        if (this.isSkipping) {
            console.warn('PromiseTask: skip requested while already skipping');
            return;
        }
        this.isSkipping = true;
        const { callback } = this;
        void Promise.resolve((_a = this.skipCallback) === null || _a === void 0 ? void 0 : _a.call(this)).then(() => {
            this.validateStatusAndCallback(callback);
            this.forceComplete();
        });
    }
    onExec(ctx, callback) {
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
exports.PromiseTask = PromiseTask;
