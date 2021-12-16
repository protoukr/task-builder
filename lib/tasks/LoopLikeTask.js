"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopLikeTask = void 0;
const BaseTask_1 = require("../BaseTask");
const BreakTask_1 = require("./BreakTask");
const ContinueTask_1 = require("./ContinueTask");
class LoopLikeTask extends BaseTask_1.BaseTask {
    constructor(label) {
        super();
        this.label = label;
    }
    handleTaskMsg(callback, msg) {
        if (typeof msg === 'object') {
            if (msg instanceof Error) {
                callback(msg);
                return true;
            }
            if (msg instanceof BreakTask_1.Break) {
                if (msg.label === undefined || msg.label === this.label) {
                    callback();
                }
                else {
                    callback(msg);
                }
                return true;
            }
            if (msg instanceof ContinueTask_1.Continue) {
                if (msg.label !== undefined && msg.label !== this.label) {
                    callback(msg);
                    return true;
                }
            }
        }
        return false;
    }
}
exports.LoopLikeTask = LoopLikeTask;
