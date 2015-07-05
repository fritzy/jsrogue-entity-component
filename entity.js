"use strict";

let assign = require('lodash/object/assign');
let PriorityEventChain = require('./prioritychain');

class Entity {
    constructor(name) {
        this.components = new Set();
        this.entities = new Set();
        this.eventChains = new PriorityEventChain();
        this.name = name || this.constructor.name;
    }

    addComponent(component) {
        if (this.components.has(component)) {
            return false;
        }
        this.components.add(component);
        this.subscribeComponent(component);
    }

    removeComponent(component) {
        if (!this.components.has(component)) {
            return false;
        }
        this.unsubscribeComponent(component);
        this.components.delete(component);
    }

    subscribeComponent(component) {
        component.handlers.forEach(function (sub) {
            this.eventChains.subscribe(sub.name, sub.priority, sub.callback, component);
        }.bind(this));
    }

    unsubscribeComponent(component) {
        component.handlers.forEach(function (sub) {
            this.eventChains.subscribe(sub.name, sub.priority, sub.callback, component);
        });
    }

    get stats() {
        let stats = {};
        for (let component of this.components) {
            assign(stats, component.stats);
        }
        return stats;
    }

    addEntity(entity) {
        if (this.entities.has(entity)) {
            return false;
        }
        this.entites.add(entity);
        for (let component of this.components) {
            this.addComponent(component);
        };
    }

    removeEntity(entity) {
        if (!this.entities.has(entity)) {
            return false;
        }
        this.entities.delete(entity);
        for (component of this.components) {
            this.removeComponent(component);
        }
    }

    emit(name, event) {
        return this.eventChains.emit(name, event);
    }
}

module.exports = Entity;
