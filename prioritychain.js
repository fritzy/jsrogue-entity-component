"use strict";

class PriorityEventChain {
    constructor() {
        this.chains = {};
        this.events = new Set();
    }

    subscribe(name, priority, callback, ctx) {
        let sub = {priority: priority, callback: callback, ctx: ctx};
        if (!this.chains.hasOwnProperty(name)) {
            this.events.add(name);
            this.chains[name] = [];
        }
        this.chains[name].push(sub);
        this.chains[name].sort(function (a, b) {
            return a.priority - b.priority;
        });
    }

    unsubscribe(name, callback) {
        if (!this.chains.hasOwnProperty(name)) {
            return;
        }
        for (var idx = 0, l = this.chains[name].length; idx < l; idx++) {
            let sub = this.chains[name][idx];
            if (sub.callback === callback) {
                this.chains[name].splice(idx, 1);
                l--;
                idx--;
            }
        }
        if (this.chains[name].length === 0) {
            delete this.chains[name];
            this.events.delete(name);
        }
    }

    emit(name, event) {
        if (!this.chains.hasOwnProperty(name)) {
            return;
        }
        for (let idx = 0, l = this.chains[name].length; idx < l; idx++) {
            let sub = this.chains[name][idx];
            let result = sub.callback.call(sub.ctx || this, event);
            if (result === false) {
                break;
            } else {
                event = result;
            }
        }
        return event;
    }
}

module.exports = PriorityEventChain;
