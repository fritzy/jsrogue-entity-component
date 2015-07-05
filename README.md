#Entity Component

This is a ECMAScript 2015 (JavaScript/ES6) Entity-styled Component System for roguelikes and other games inspired by [Brian Bucklew's IRDC US 2015 Talk](https://www.youtube.com/watch?v=U03XXzcThGU).

A Component based approach to games allows you to add functionality without reorganizing your object code to handle new features, and is a popular approach to modern game development.

## Install

`npm i --save @jsrogue/entity-component`

## Example

```javascript
'use strict';

let EC = require('@jsrogue/entity-component');

class Health extends EC.Component {
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

class Armor extends EC.Component {
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

let person = new EC.Entity();
let health = new Health({hp: 100});
let armor = new Armor();
person.addComponent(health);
person.addComponent(armor);
person.emit('takeHit', {dmg: 8});
console.log(person.stats); // {hp: 96}
```

## Usage


## License and Copyright

The MIT License (MIT)

Copyright © 2015 Nathanael C. Fritz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
