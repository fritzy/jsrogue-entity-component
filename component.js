"use strict";

class Component {
    constructor(stats) {
        this.stats = stats || {};
        this.name = this.constructor.name;
        this.handlerMap = {};
    }

    get handlers() {
        let handlers = [];
        Object.keys(this.handlerMap).forEach(function (name) {
            handlers.push({name: name, priority: this.handlerMap[name].priority, callback: this.handlerMap[name].func});
        }.bind(this));
        return handlers;
    }
}

module.exports = Component;
