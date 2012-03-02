# pd [![Build Status][1]][2]

Helping you do prototypical OO

## Status: production ready

## Example 

    var Animal = {
        legs: 4,
        walk: function () { ... }
    };

    var Cat = pd.extend(Object.create(Animal), {
        nyan: function () { ... },
        constructor: function () { this.lives = 9; return this; }
    });

    var cat = Object.create(Cat).constructor();

## Motivation

ES5 OO is [verbose][8]

pd solves this with utilities and sugar.

## Blog Posts

 - [Improving ES5 OO][9]
 - [Doing OO JS part 3][6]
 - [Doing OO JS part 2][5]
 - [Doing Object Oriented JavaScript][3]

## Documentation

### <a name="pd" href="#pd">pd (obj)</a>

pd converts all the values of your objects properties into property descriptors of those values.

    pd({
        "foo": "bar"
    })

is the same as

    {
        "foo": {
            "value": "bar",
            "enumerable": true,
            "writable": true,
            "configurable": true
        }
    }

### <a name="pd.extend" href="#pd.extend">pd.extend (obj..)</a>

pd.extend extends an object with other objects. key clashes are given right preference

    pd.extend(
        {
            "one": "faz",
            "three": "bar"
        },
        {
            "two": "ni",
            "three": "baz"
        },
        {
            "three": "bas",
            "four": "four"
        }
    );

is the same as

    {
        "one": "faz",
        "two": "ni",
        "three": "bas",
        "four": "four"
    }
    
pd.extend returns the first object you pass in.

### <a name="pd.bindAll" href="#pd.bindAll">pd.bindAll (obj..)</a>

pd.bindAll is similar to underscore's bindAll method. It takes an object and binds all it's methods to the object. It takes an optional list of objects to mix in

    var o = {
        constructor() { 
            pd.bindAll(this, {
                draw: function () { 
                    /* use `this` with its "correct" value, i.e. `o` */
                }
            });
        },
        start: function (eventEmitter) {
            // note `this.draw` would not work correctly if it wasn't bound
            eventEmitter.on("draw", this.draw);
        }
    };

### <a name="pd.Name" href="#pdName">pd.Name</a>

pd.Name constructs a Name function. This name function when passed your object will
return a privates object. This privates object cannot be accessed in any other 
way then calling Name.

Example:

    var Klass = (function () {
        var privates = pd.Name();

        return {
            constructor: function (secret) {
                privates(this).secret = secret;
            },
            getSecret: function () {
                return privates(this).secret;
            }
        };
    }());

## Installation

`npm install pd`

## Test

`make test`

## Contributors

 - Raynos
 - Gozala

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/pd.png
  [2]: http://travis-ci.org/Raynos/pd
  [3]: http://raynos.org/blog/4/Doing-Object-Oriented-JavaScript
  [4]: http://www.2ality.com/2011/06/prototypes-as-classes.html
  [5]: http://raynos.org/blog/5/Doing-Object-Oriented-Javascript---part-2
  [6]: http://raynos.org/blog/7/Doing-Object-Oriented-Javascript---part-3
  [8]: https://gist.github.com/1384024
  [9]: http://raynos.org/blog/17/Improving-ES5-OO-with-pd