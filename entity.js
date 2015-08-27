"use strict";

let assign = require('lodash/object/assign');
let PriorityEventChain = require('./prioritychain');

class Entity {
    constructor(name) {
        this.components = new Set();
        this.entities = new Set();
        this.eventChains = new PriorityEventChain();
        this.name = name || this.constructor.name;
        this.entityMap = new Map();
        this.parent = null;
        this.root = this;
        this.stats = {};
    }
    
    updateRoot() {
        let root = this;
        if (this.parent !== null) {
            root = this.parent.updateRoot();
        }
        this.root = root;
        return root;
    }

    getEntityByName(name) {
        let entity = null;
        if (this.name === name) {
            return this;
        }
        if (this.parent !== null) {
            entity = this.parent.getEntityByName(name);
        }
        return entity;
    }

    addStat(name, component) {
        Object.defineProperty(this.stats, name, {
            get: function () {
                return component.stats[name];
            },
            set: function (val) {
                component.stats[name] = val;
                this[name] = val;
            },
            configurable: true,
            enumerable: true
        });
    }
    
    removeStat(name) {
        delete this.stats[name];
    }

    addComponent(component, remote) {
        if (this.components.has(component)) {
            return false;
        }
        this.components.add(component);
        this.subscribeComponent(component);
        if (!remote) {
            component.setEntity(this);
        }
    }

    removeComponent(component, remote) {
        if (!this.components.has(component)) {
            return false;
        }
        this.unsubscribeComponent(component);
        this.components.delete(component);
        if (!remote) {
            component.removeEntity(this);
        }
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

    addEntity(entity) {
        if (this.entities.has(entity)) {
            return false;
        }
        if (entity.parent !== null) {
            entity.parent.removeEntity(entity);
        }
        this.entites.add(entity);
        for (let component of this.components) {
            this.addComponent(component, true);
        };
        entity.parent = this;
        entity.updateRoot();
        this.entityMap.set(entity.name, entity);
        entity.emit('addEntity', {entity: this});
    }

    removeEntity(entity) {
        if (!this.entities.has(entity)) {
            return false;
        }
        this.entities.delete(entity);
        for (component of this.components) {
            this.removeComponent(component, true);
        }
        entity.parent = null;
        entity.updateRoot();
        this.entityMap.delete(entity.name);
        entity.emit('removeEntity', {entity: this});
    }

    emit(name, event) {
        return this.eventChains.emit(name, event);
    }
}

module.exports = Entity;
