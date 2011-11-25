# pd

Helping you do prototypical OO

## Example 

    var Animal = {
        legs: 4,
        walk: function () { ... }
    };

    var Cat = pd.make(Animal, {
        nyan: function () { ... },
        constructor: function () { this.lives = 9; }
    });

    var cat = pd.beget(Cat);

## Motivation

ES5 OO is [verbose][8]

pd solves this with utilities and sugar.

## Blog Posts

 - [Improving ES5 OO][9]
 - [Doing OO JS part 3][6]
 - [Doing OO JS part 2][5]
 - [Doing Object Oriented JavaScript][3]

## Documentation

### pd (obj) <a name="pd" href="#pd"><small><sup>link</sup></small></a>

pd converts all the values of your objects properties into propertydescriptors of those values.

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

### pd.extend (obj..) <a name="pd.extend" href="#pd.extend"><small><sup>link</sup></small></a>

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

### pd.make (proto, props...) <a name="pd.make" href="#pd.make"><small><sup>link</sup></small></a>

pd.make takes a prototype and some properties, it creates a new instance of the prototype and extends that instances with the properties.

    pd.make(Proto, {
        prop: "42"
    }, {
        another_prop: 42
    });

### pd.beget (proto, args..) <a name="pd.beget" href="#pd.beget"><small><sup>link</sup</small></a>

pd.beget takes a prototype and creates a new instance of it. it will then call the constructor property of the new instance with the arguments and finally returns the object

    var Proto = {
        method: function () {
            console.log("method");
        },
        constructor: function (arg) {
            console.log("constructed", arg);    
        }
    };

    var o = pd.beget(Proto, 42); // "constructed", 42
    console.log(Proto.isPrototypeOf(o)); // true
    o.method(); // "method"

This basically is meant as sugar to allow ["prototypes as classes"][4]
    
### pd.extendNatives <a name="pd.extendNatives" href="#pd.extendNatives"><small><sup>link</sup></small></a>

pd.extendNatives extends some native objects and then returns pd.

Specifically it will set the following if they don't exist

 - Object.extend (same as pd.extend)
 - Object.getOwnPropertyDescriptors (same as pd)
 - Object.beget (same as pd.beget)
 - Object.make (same as pd.make)
 - Object.Name (same as pd.Name)

It will also augment `Object.prototype` if you pass in `true` as the first argument
You can also pass an array of properties you want it to be extended with.

Example:

    pd.extendNatives(["beget"])

 - Object.prototype.beget (same as pd.beget)
 - Object.prototype.make (same as pd.make)
 - Object.prototype.extend (same as pd.extend)

An example of `.beget` which only takes arguments

    var instance = Proto.beget(42)

An example of `.make` which only extends it with one argument

    var SubClass = Proto.make({ /* subclass properties */ })

An example of `.extend` (extend mutates the object)

    Proto.extend({ /* more proto properties */ })

### pd.Name <a name="pd.Name" href="#pdName"><small><sup>link</sup</small></a>

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

### pd.Base <a name="pd.Base" href="#pd.Base"><small><sup>link</sup></small></a>

There is also a `pd.Base` object which has the method `extend`, `beget` and `make` defined on it.

This means you can program in a style that would normally require extending `Object.prototype`.

Example:

    var Child = pd.Base.make({ /* child props */ });
    Child.extend({ /* more props */ });

    var childInstance = Child.beget();

## Installation

npm install pd

## Test

node tests/pd-test.js

## Contributors

 - Raynos
 - Gozala

## MIT Licenced

  [3]: http://raynos.org/blog/4/Doing-Object-Oriented-JavaScript
  [4]: http://www.2ality.com/2011/06/prototypes-as-classes.html
  [5]: http://raynos.org/blog/5/Doing-Object-Oriented-Javascript---part-2
  [6]: http://raynos.org/blog/7/Doing-Object-Oriented-Javascript---part-3
  [8]: https://gist.github.com/1384024
  [9]: http://raynos.org/blog/17/Improving-ES5-OO-with-pd