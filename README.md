# pd <a name="_pd" href="#_pd"><small><sup>link</sup></small></a>

A small utility for writing OO javascript.

pd is short for property descriptor.

It converts objects into property descriptors. So you can create objects like:

    var o = Object.create(somePrototype, pd({
        "someProp": "someValue",
        get someGetter() {
            
        },
        set someSetter() {
            
        }
    }));
    
## Blog posts <a name="Blog_posts" href="#Blog_posts"><small><sup>link</sup></small></a>

 - [Doing Object Oriented JavaScript][3]
 - [Doing OO JS part 2][5]
 - [Doing OO JS part 3][6]

## Examples <a name="Examples" href="#Examples"><small><sup>link</sup></small></a>

 [OO utilities][7]

## Documentation <a name="Documentation" href="#Documentation"><small><sup>link</sup></small></a>

See the source >_>

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

### pd.make (proto, props) <a name="pd.make" href="#pd.make"><small><sup>link</sup></small></a>

pd.make takes a prototype and some properties, it creates a new instance of the prototype and extends
that instances with the properties.

    pd.make(Proto, {
        prop: "42"
    });

### pd.beget (proto, args..) <a name="pd.beget" href="#pd.beget"><small><sup>link</sup</small></a>

pd.beget takes a prototype and creates a new instance of it. it will then call the constructor
property of the new instance with the arguments and finally returns the object

    var Proto = {
        method: function () {
            console.log("method");
        },
        constructor: function (arg) {
            console.log("constructed", arg);    
        }
    };

    var o = pd.new(Proto, 42); // "constructed", 42
    console.log(Proto.isPrototypeOf(o)); // true
    o.method(); // "method"

This basically is meant as sugar to allow ["prototypes as classes"][4]
    
### pd.extendNatives <a name="pd.extendNatives" href="#pd.extendNatives"><small><sup>link</sup></small></a>

pd.extendNatives extends some native objects and then returns pd.

Specifically it will set the following if they don't exist

 - Object.extend (same as pd.extend)
 - Object.getOwnPropertyDescriptors (same as pd)
 - Object.beget (same as pd.beget)
 - Object.prototype.beget (same as pd.beget)
 - Object.make (same as pd.make)
 - Object.Name (same as pd.Name)

An example of `.new` which only takes arguments

    Proto.new(42)

### pd.Name <a name="pd.Name" href="#pdName"><small><sup>link</sup</small></a>

pd.Name does shit, read the source \o/. I mean docs soon.


  [1]: http://raynos.github.com/pd/docs/pd.html
  [2]: http://raynos.github.com/vows-fluent/docs/vows-fluent.html
  [3]: http://raynos.org/blog/4/Doing-Object-Oriented-JavaScript
  [4]: http://www.2ality.com/2011/06/prototypes-as-classes.html
  [5]: http://raynos.org/blog/5/Doing-Object-Oriented-Javascript---part-2
  [6]: http://raynos.org/blog/7/Doing-Object-Oriented-Javascript---part-3
  [7]: https://gist.github.com/1352801