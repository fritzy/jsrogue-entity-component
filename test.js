"use strict";

let EC = require('./index.js');

let Component = EC.Component;
let Entity = EC.Entity;

class Health extends Component {
    constructor(stats) {
        super(stats);
        this.stats.hp = stats.hp || 10;
        this.addHandler('takeHit', this.onHit, 100);
    }

    setEntity(entity) {
        super.setEntity(entity);
        entity.addStat('hp', this);
    }

    removeEntity(entity) {
        super.removeEntity(entity);
        entity.removeStat('hp');
    }

    onHit(event) {
        this.stats.hp -= event.dmg;
        return event;
    }
}

class Armor extends Component {
    constructor(stats) {
        super(stats);
        this.addHandler('takeHit', this.onHit, 50);
    }

    onHit(event) {
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
for (let stat in person.stats) {
    console.log("%s: %s", stat, person.stats[stat]);
}

