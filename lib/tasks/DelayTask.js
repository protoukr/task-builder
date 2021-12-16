"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayTask = void 0;
const BaseTask_1 = require("../BaseTask");
function _setTimeout(callback, time) {
    const id = setTimeout(callback, time);
    return () => clearTimeout(id);
}
class DelayTask extends BaseTask_1.BaseTask {
    constructor(time, setTimeout = _setTimeout) {
        super();
        this.time = time;
        this.setTimeout = setTimeout;
    }
    onStopped() {
        var _a;
        super.onStopped();
        (_a = this.clearTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    onSkipRequested() {
        var _a;
        super.onSkipRequested();
        (_a = this.clearTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
        this.forceComplete();
    }
    onExec(ctx, callback) {
        const time = (0, BaseTask_1.evaluateValue)(ctx, this.time);
        this.clearTimeout = this.setTimeout(callback, time);
    }
}
exports.DelayTask = DelayTask;
