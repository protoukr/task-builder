"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
class Hook {
    constructor(hookName, taskProvider, owner, cacheable = true) {
        this.hookName = hookName;
        this.taskProvider = taskProvider;
        this.owner = owner;
        this.cacheable = cacheable;
    }
    get task() {
        if (this._task != null) {
            return this._task;
        }
        const task = this.taskProvider();
        if (this.cacheable) {
            this._task = task;
        }
        return task;
    }
}
class Hooks {
    constructor() {
        this.hooks = [];
    }
    registerHook(info) {
        this.ensureHookNotExists(info.hookName, info.taskProvider);
        const hook = new Hook(info.hookName, info.taskProvider, info.owner, info.cacheable);
        this.hooks.push(hook);
    }
    unregisterOwnerHooks(owner) {
        this.hooks = this.hooks.filter((hook) => hook.owner !== owner);
    }
    unregisterHooks(hookName) {
        this.hooks = this.hooks.filter((hook) => hook.hookName !== hookName);
    }
    unregisterHook(hookName, taskProvider) {
        const index = this.hooks.findIndex((hook) => hook.hookName === hookName && hook.taskProvider === taskProvider);
        if (index !== -1) {
            this.hooks.splice(index, 1);
        }
    }
    hookTasks(hookName) {
        return this.hooks
            .filter((hook) => hook.hookName === hookName)
            .map((hook) => hook.task);
    }
    ensureHookNotExists(hookName, taskProvider) {
        if (this.checkIfHookExists(hookName, taskProvider)) {
            throw new Error(`Hook ${hookName} already exists`);
        }
    }
    checkIfHookExists(hookName, taskProvider) {
        return (this.hooks.find((hook) => hook.hookName === hookName && hook.taskProvider === taskProvider) != null);
    }
}
exports.Hooks = Hooks;
