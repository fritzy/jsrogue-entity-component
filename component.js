"use strict";

class Component {
    constructor(stats, priority) {
        this.priority = priority || 0;
        this.stats = stats || {};
        this.name = this.constructor.name;
        this.handlers = [];
        this.entity = null;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    removeEntity(entity) {
        this.entity = null;
    }

    addHandler(eventName, func, priority) {
        if (typeof priority === 'undefined') {
            priority = this.priority;
        }
        this.handlers.push({name: eventName, priority: priority, callback: func});
    }

}

module.exports = Component;
