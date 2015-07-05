"use strict";

let EC = require('./index.js');

let Component = EC.Component;
let Entity = EC.Entity;

class Health extends Component {
    constructor(stats) {
        super(stats);
        this.stats.hp = stats.hp || 10;
        this.handlerMap.takeHit = {
            func: this.handleHit,
            priority: 100
        }
    }

    handleHit(event) {
        this.stats.hp -= event.dmg;
        return event;
    }
}

class Armor extends Component {
    constructor(stats) {
        super(stats);
        this.handlerMap.takeHit = {
            func: this.handleHit,
            priority: 50
        }
    }

    handleHit(event) {
        event.dmg *= .5;
        return event;
    }
}

let person = new Entity();
let health = new Health({hp: 100});
let armor = new Armor();
person.addComponent(health);
person.addComponent(armor);
person.emit('takeHit', {dmg: 2});
console.log(person.stats);

