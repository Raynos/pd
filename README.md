# <a href="#pd" name="pd">pd</a> [![Build Status][1]][2]

Helping you do prototypical OO

## Status: production ready

## <a href="#Example" name="Example">Example</a>

    var extend = require("pd").extend

    var Animal = {
        legs: 4,
        walk: function () { ... }
    }

    var Cat = extend({}, Animal, {
        nyan: function () { ... },
        initialize: function () { 
            this.lives = 9
            return this;
        }
    });

    var cat = extend({}, Cat).initialize()

## <a href="#mov" nane="mov">Motivation</a>

ES5 OO is [verbose][8]

pd solves this with utilities and sugar.

## <a name="blogs" href="#blogs">Blog Posts</a>

 - [Improving ES5 OO][9]
 - [Doing OO JS part 3][6]
 - [Doing OO JS part 2][5]
 - [Doing Object Oriented JavaScript][3]

## <a name="Documentation" href="#Documentation">Documentation</a>

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
        constructor: function () { 
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

### <a name="pd.Name" href="#pd.Name">pd.Name</a>

pd.Name constructs a Name function. This name function when passed your object will
return a privates object. This privates object cannot be accessed in any other 
way then calling Name.

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

### <a name="pd.memoize" href="#pd.memoize">pd.memoize(fn[, context[, hasher]]</a>

pd.memoize caches the results of an asynchronous function. Pass in an optional
context so the fn is called with the context and pass in an optional hasher so
you can choose how your the arguments of the returned memoized function should
map to results

    var f = pd.memoize(asyncFunction),
        start = Date.now()

    f(10)
    f(10)
    f(10)

    var time_taken = Date.now() - start // roughly 500
    // because asyncFunction is memoized, the second and third call return
    // at the same time as the first, and any call after that returns
    // immediately

    function asyncFunction(key, callback) {
        setTimeout(function () {
            callback(key * 2)
        }, 500)
    }

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